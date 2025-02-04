import {
    collection,
    addDoc,
    getDocs, 
    deleteDoc, 
    GeoPoint // 座標データを扱うためのクラス
} from "firebase/firestore";
import { db } from "../firebase"; // Firestore の初期化

/* 構築手順 (実行時に並び替え)
1.コレクションを全て削除
2.コレクション、フィールドを定義 (テストデータを追加する形式)
*/


// コレクション, フィールドを定義

// コレクション名称を定義
const collectionNames = ["users", "weatherData", "ai"];
const subCollectionNames = {
  users: ["profile", "health", "dailyStatus"],
  weatherData: [], // サブコレクションがない場合は空配列
  ai: ["predictionAI", "assistantAI", "commentAI"]
};


// 1. コレクション "user" の生成
async function createUsers() {
  try {
    const docRef = await addDoc(collection(db, collectionNames[0]), {
        userId: "testUser", 
        name: "testUser",
      });
    console.log(`コレクション "${collectionNames[0]}" を生成しました。`, docRef.id);

    // 1-1. サブコレクション "profile" の生成
    const profileCollectionRef = collection(docRef, subCollectionNames.users[0]);
    const profileDocRef = await addDoc(profileCollectionRef, {
        birthDate: new Date("1990-01-01"),
        gender: 0, // index 0: 男性, 1: 女性, 2: その他
        character: 0, // index 0: ハムスター, 1: モモンガ, 2: 猫
        registeredAt: new Date(),
        updatedAt: new Date()
    });
    console.log(`サブコレクション "${subCollectionNames.users[0]}" を生成しました。`, profileDocRef.id);

    // 1-2. サブコレクション "health" の生成
    const healthCollectionRef = collection(docRef, subCollectionNames.users[1]);
    const healthDocRef = await addDoc(healthCollectionRef, {
        heightCm: 170,
        weightKg: 60,
        drinkingHabit: "moderate",
        smokingStatus: "none",
        registeredAt: new Date(),
        updatedAt: new Date()
    });
    console.log(`サブコレクション "${subCollectionNames.users[1]}" を生成しました。`, healthDocRef.id);

    // 1-3. サブコレクション "dailyStatus" の生成
    const dailyStatusCollectionRef = collection(docRef, subCollectionNames.users[2]);
    const dailyStatusDocRef = await addDoc(dailyStatusCollectionRef, {
        location: new GeoPoint(35.6895, 139.6917),
        sleepHours: 7,
        createDate: new Date()
    });
    console.log(`サブコレクション "${subCollectionNames.users[2]}" を生成しました。`, dailyStatusDocRef.id);

    return docRef.id; // 生成したドキュメントのIDを返す
  } catch (e) { // エラー処理
    console.error("生成エラー", e);
    throw e;
  }
};

// 2.weatherDataコレクションの生成
async function createWeatherData() {
  try {
    const docRef = await addDoc(collection(db, collectionNames[1]), {
        location: new GeoPoint(35.6895, 139.6917),
        forecastDate: new Date(),
        weatherCode: 0, // index 0: 晴れ ~ 99: 雷雨
        temperatureMax: 25,
        temperatureMin: 15,
        apparentTemperatureMax: 28,
        apparentTemperatureMin: 18,
        humidity: 60,
        pressure: 1013,
        windSpeed: 5,
    });
    console.log(`コレクション "${collectionNames[1]}" を生成しました。`, docRef.id);

    return docRef.id; // 生成したドキュメントのIDを返す
  } catch (e) { // エラー処理
    console.error("生成エラー", e);
    throw e;
  }
};

// 3.aiコレクションの生成
async function createAi() {
    try {
      const docRef = await addDoc(collection(db, collectionNames[2]), {
            recordId: "healthRecord000",
            userId: "testUser",
            GeneratedDate: new Date()
    });
    console.log(`コレクション "${collectionNames[2]}" を生成しました。`, docRef.id);

    // 3-1. サブコレクション "predictionAI" の生成
    const predictionAICollectionRef = collection(docRef, subCollectionNames.ai[0]);
    const predictionAIDocRef = await addDoc(predictionAICollectionRef, {
        headacheLevel: 1,
    });
    console.log(`サブコレクション "${subCollectionNames.ai[0]}" を生成しました。`, predictionAIDocRef.id);

    // 3-2. サブコレクション "assistantAI" の生成
    const assistantAICollectionRef = collection(docRef, subCollectionNames.ai[1]);
    const assistantAIDocRef = await addDoc(assistantAICollectionRef, {
        emotion: 0, // index 0: happy, 1: sad, 2: angry
        comment: "You are in good condition today."
    });
    console.log(`サブコレクション "${subCollectionNames.ai[1]}" を生成しました。`, assistantAIDocRef.id);

    // 3-3. サブコレクション "commentAI" の生成
    const commentAICollectionRef = collection(docRef, subCollectionNames.ai[2]);
    const commentAIDocRef = await addDoc(commentAICollectionRef, {
        weather: "happy",
        comment: "You are in good condition today."
    });
    console.log(`サブコレクション "${subCollectionNames.ai[2]}" を生成しました。`, commentAIDocRef.id);

    return docRef.id; // 生成したドキュメントのIDを返す
  } catch (e) { // エラー処理
    console.error("生成エラー", e);
    throw e;
  }
};

// 全てのコレクションを削除

// 指定のドキュメントとそのサブコレクションを再帰的に削除する関数を作成
const deleteDocumentRecursively = async (docRef, subCollectionNames = []) => {
  // 既知のサブコレクションを取得して削除
  for (const subColName of subCollectionNames) {
    const subColRef = collection(docRef, subColName);
    const subSnapshot = await getDocs(subColRef);
    const subDeletePromises = subSnapshot.docs.map((subDoc) =>
      // サブコレクションにさらに深いネストがなければ、空配列を渡して削除
      deleteDocumentRecursively(subDoc.ref, [])
    );
    await Promise.all(subDeletePromises); // サブコレクションの削除を待つ

    console.log(`サブコレクション "${subColName}" を削除しました。`, docRef.id);
  }
  await deleteDoc(docRef); // 親ドキュメント削除
};

// 全てのコレクション・サブコレクションを削除
export const deleteDocuments = async (collectionNames) => {
  try {
    for (const colName of collectionNames) {
      // colName に対応するサブコレクションを取得（無い場合は空配列を取り出す）
      const subColNames = subCollectionNames[colName] || [];
      const colRef = collection(db, colName);
      const querySnapshot = await getDocs(colRef);

      // コレクション内の全ドキュメントを削除
      const deletePromises = querySnapshot.docs.map((doc) => {
        console.log(`コレクション "${colName}" を削除しました。`, doc.id); // map関数内でログ出力
        return deleteDocumentRecursively(doc.ref, subColNames);
      });
      await Promise.all(deletePromises); // ドキュメントの削除を待つ
    }
    console.log("すべてのコレクションの初期化に成功しました。");
  } catch (e) {
    console.error("削除エラー:", e);
    throw e;
  }
};


// コレクションの処理を一元化する (削除 -> 生成)
async function  setupCollections() {
  await deleteDocuments(collectionNames); // XXX: 削除処理、気をつけて！！
  await createUsers();
  await createWeatherData();
  await createAi();
}

export default { setupCollections }; // 外部で実行 & エラー処理
