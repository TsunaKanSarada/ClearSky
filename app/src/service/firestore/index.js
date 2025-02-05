import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
  deleteDoc,
  GeoPoint, // 座標データを扱うためのクラス
} from "firebase/firestore";
import { db } from "../firebase"; // Firestore の初期化

// 認証ユーザーの UID を取得する処理
import { getCurrentUserUID } from "../auth";
const uid = getCurrentUserUID();


// コレクション, フィールドを定義
// コレクション名称を定義
const collectionName = "users";
const subCollectionNames = {
  users: ["profile", "dailyRecords"],
};

// map部分を共通化
const mapName = { 
  Records: { // currentRecordsとdailyRecordsの共通フィールド
    location: new GeoPoint(35.6895, 139.6917),
    sleepHours: 8,
    weather: {
      location: new GeoPoint(35.6895, 139.6917),
      forecastDate: new Date(),
      weatherCode: 0, // index 0: 晴れ ~ 99: 雷雨
      temperatureMax: 25,
      temperatureMin: 15,
      apparentTemperatureMax: 22, // 体感最高気温
      apparentTemperatureMin: 10, // 体感最低気温
      humidity: 60,
      pressure: 1013,
      windSpeed: 3,
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

async function setCollections(userId) { // HACK Firebase Authentication の UID
    try {
      // 1. users コレクションにドキュメントを作成
      const userDocRef = doc(db, "users", userId);
      await setDoc(userDocRef, {
        userId: userId,
        name: "Test User",
        character: 0, // 0: ハムスター, 1: モモンガ, 2: 猫
        currentRecords: {
          // currentRecords (map) -> フロントへ最も頻繁に渡すデータ
          // mapName.Records を展開
          ...mapName.Records,
          // mapName.ai を展開
          ai: mapName.ai,
          updatedAt: new Date(),
        },
      });
  
      // 2. profile サブコレクションにドキュメントを作成
      const profileCollectionRef = collection(userDocRef, subCollectionNames.users[0]);
      await addDoc(profileCollectionRef, {
        birthDate: new Date("1990-01-01"),
        gender: 0, // 0: 男性, 1: 女性, 2: その他
        heightCm: 170,
        weightKg: 65,
        DrinkingHabit: 1, // 0: 飲まない, 1: あまり飲まない, 3: よく飲む, 4: 頻繁に飲む
        smokingHabit: 0, // 0: 吸わない, 1: あまり吸わない, 3: よく吸う, 4: 頻繁に吸う
        registeredAt: new Date(),
        updatedAt: new Date(),
      });
  
      // 3. dailyRecords サブコレクションに日次の履歴ドキュメントを作成（例として1件のみ）
      const dailyRecordsCollectionRef = collection(userDocRef, subCollectionNames.users[1]);
      await addDoc(dailyRecordsCollectionRef, {
        // mapName.Records を展開
        ...mapName.Records,
        // mapName.ai を展開
        ai: mapName.ai,
        createdDate: new Date(),
      });
  
      console.log(
        `ユーザー "${userId}" に必要なコレクション・サブコレクションを作成しました。`
      );
    } catch (error) {
      console.error("Error setting up collections:", error);
      throw error;
    }
  }

// 全てのコレクションを削除

// 指定のドキュメントとそのサブコレクションを再帰的に削除する関数を作成
const deleteDocumentRecursively = async (docRef, subCollectionNames) => {
  // サブコレクションを取得して削除
  for (const subColName of subCollectionNames) {
    const subColRef = collection(docRef, subColName);
    const subSnapshot = await getDocs(subColRef);
    const subDeletePromises = subSnapshot.docs.map((subDoc) =>
      // サブコレクションにさらに深いネストがなければ、空配列を渡して削除
      deleteDocumentRecursively(subDoc.ref, [])
    );
    await Promise.all(subDeletePromises); // サブコレクションの削除を待つ

    console.log(`サブコレクション "${subColName}" を削除します。`, docRef.id);
  }
  await deleteDoc(docRef); // 親ドキュメント削除
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

export default { setupCollections }; // 外部で実行 & エラー処理
