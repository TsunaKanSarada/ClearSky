/* DBの初期設定やコレクション生成・削除関数*/

import {
  collection,
  runTransaction, // トランザクションのインポート(中にsetDoc, deleteDocなどが含まれる)
  doc,
  getDocs,
  GeoPoint, // 座標データを扱うためのクラス
  Timestamp, // Firestoreの日付データを扱うためのクラス
} from "firebase/firestore";
import { db } from "../../app/src/services/firebase"; // Firestoreのインポート

import readline from "readline"; // npmコマンドにて削除時、ユーザー入力を受け付けるためのライブラリ

// 認証ユーザーの UID を取得する処理
import { getCurrentUserUID } from "../auth";
const uid = getCurrentUserUID();


// コレクション, フィールドを定義
// コレクション名称を定義
export const collectionName = "users";
export const subCollectionNames = {
  users: ["profile", "dailyRecords"],
};

// map部分を共通化
export const commonMap = { 
  Records: { // currentRecordsとdailyRecordsの共通フィールド
    sleepHours: 8,
    weather: {
      location: new GeoPoint(35.6895, 139.6917),
      forecastDate: new Date(),
      weatherCode: 0, // index 0: 快晴 ~ 99: 雷雨
      temperatureMax: 25,
      temperatureMin: 15,
      apparentTemperatureMax: 22, // 体感最高気温
      apparentTemperatureMin: 10, // 体感最低気温
      humidity: 60,
      pressure: 1013,
      windSpeed: 3,
      uv: 5 // 紫外線 0: なし ~ 11: 非常に強い
    },
  },
  ai: {
    prediction: { // 予測AI
      headacheLevel: 1,
      GeneratedDate: new Date(),
    },
    assistant: { // アシスタントAI
      emotion: 2,
      comment:
        "気分は上場ですね！\nただ、前日はあまり眠れていないようです...\n無理はせず、今日は早めに寝ましょう！",
      GeneratedDate: new Date(),
    },
    comment: { // 短文コメントAI
      weather:
        "今日は寒く、風が強いですね...。防寒対策をしてお出かけください！",
      condition: "気分上場 ♪ ",
      GeneratedDate: new Date(),
    },
  },
};

export async function setCollections(userId) {
  try {
    const userDocRef = doc(db, "users", userId);
    const profileDocRef = doc(userDocRef, subCollectionNames.users[0], "profileDoc");
    const dailyRecordsDocRef = doc(collection(userDocRef, subCollectionNames.users[1]));
    const today = new Date();
    today.setHours(0,0,0,0); // 今日の0時0分0秒にする

    await runTransaction(db, async (transaction) => {
      // 1. ユーザードキュメントを作成
      transaction.set(userDocRef, {
        userId: userId,
        name: "Test User",
        character: 0,
        currentRecords: { // currentRecords は初期化データとしては最小限にしておく
          weather: { // 最新の天気情報くらいは持っておく
              location: commonMap.Records.weather.location,
              forecastDate: Timestamp.fromDate(commonMap.Records.weather.forecastDate),
          }
        },
      });

      // 2. profile サブコレクションのドキュメントを作成 (変更なし)
      transaction.set(profileDocRef, {
        birthDate: new Date("1990-01-01"),
        gender: 0,
        heightCm: 170,
        weightKg: 65,
        DrinkingHabit: 1,
        smokingHabit: 0,
        registeredAt: new Date(),
        updatedAt: new Date(),
      });

        // 3. dailyRecords サブコレクションのドキュメントを作成 (修正)
        transaction.set(dailyRecordsDocRef, {
          createdDate: Timestamp.fromDate(today),
          weather: commonMap.Records.weather,
          ai: commonMap.ai,
          sleepHours: 8, // sleepHours の初期値を設定
          updatedAt: Timestamp.fromDate(today),
        });
      });

    console.log(
      `ユーザー "${userId}" に必要なコレクション・サブコレクションをトランザクションで作成しました。`
    );
  } catch (error) {
    console.error("Error setting up collections:", error);
    throw error;
  }
}

// 全てのコレクションを削除

// 指定のドキュメントとそのサブコレクションを再帰的に削除する関数
const deleteDocumentRecursively = async (docRef, subCollectionNames) => {
    // サブコレクション内のドキュメントを再帰的に削除
    for (const subColName of subCollectionNames) {
      const subColRef = collection(docRef, subColName);
      const subSnapshot = await getDocs(subColRef);
      const subDeletePromises = subSnapshot.docs.map((subDoc) =>
        // ネストが無い場合は [] を渡す（必要であれば対象のサブコレクション名を渡す）
        deleteDocumentRecursively(subDoc.ref, [])
      );
      await Promise.all(subDeletePromises);
      console.log(`サブコレクション "${subColName}" を削除します。`, docRef.id);
    }
    
    // トランザクション内で該当ドキュメントを削除
    await runTransaction(db, async (transaction) => {
      transaction.delete(docRef);
    });
  };

// 全てのコレクション・サブコレクションを削除
export const deleteDocuments = async (collectionName) => {
    try {
      // collectionName に対応するサブコレクションを取得（無い場合は空配列を取り出す）
      const subColNames = subCollectionNames.users || [];
      const colRef = collection(db, collectionName);
      const querySnapshot = await getDocs(colRef);
  
      // コレクション内の全ドキュメントを削除
      const deletePromises = querySnapshot.docs.map((doc) => {
        console.log(`コレクション "${collectionName}" のドキュメントを削除します。`, doc.id);
        return deleteDocumentRecursively(doc.ref, subColNames);
      });
      await Promise.all(deletePromises); // ドキュメントの削除を待つ
  
      console.log("すべてのコレクションの初期化に成功しました。");
    } catch (e) {
      console.error("削除エラー:", e);
      throw e;
    }
  };

/* 構築手順 (実行時に並び替え)
1.コレクションを全て削除
2.コレクション、フィールド等を定義 (テストデータを追加する形式)
*/

// コレクションの処理を一元化する (削除 -> 生成)
async function setupCollections() {
  await deleteDocuments(collectionName); // XXX: 削除処理、気をつけて！！
  // ユーザーがサインインしている場合のみ生成処理を実行
  if (uid) { 
    await setCollections(uid);
  } else {
    console.error("ユーザーがサインインしていません。");
  }
}

// 対話的確認処理
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "この操作は Firestore のデータを削除します。実行してよろしいですか？ (y/n): ",
  async (answer) => {
    if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
      const uid = getCurrentUserUID();
      if (!uid) {
        console.error("ユーザーがサインインしていません。");
      } else {
        // 実際の削除・セットアップ処理を呼び出し
        setupCollections().catch(console.error); // ファイル内で直接実行
      }
    } else {
      console.log("操作がキャンセルされました。");
    }
    rl.close();
  }
);
