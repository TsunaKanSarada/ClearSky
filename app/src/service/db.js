import {
    collection,
    addDoc,
    getDocs, 
    deleteDoc, 
    GeoPoint // 座標データを扱うためのクラス
} from "firebase/firestore";
import { db } from "./firebase"; // Firestore の初期化

/* 構築手順 (実行時に並び替え)
1.コレクションを全て削除
2.コレクション、フィールドを定義 (テストデータを追加する形式)
*/


// コレクション, フィールドを定義

// コレクション名称を定義
const collectionNames = ["users", "weatherData", "aiInteractions"];
const subcollectionNames = {
  users: ["profile", "health", "dailyStatus"],
  weatherData: [], // サブコレクションがない場合は空配列
  aiInteractions: ["predictionAI", "commentAI"]
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
    const profileCollectionRef = collection(docRef, subcollectionNames.users[0]);
    const profileDocRef = await addDoc(profileCollectionRef, {
        birthDate: new Date("1990-01-01"),
        gender: "",
        registeredAt: new Date(),
        updatedAt: new Date()
    });
    console.log(`サブコレクション "${subcollectionNames.users[0]}" を生成しました。`, profileDocRef.id);

    // 1-2. サブコレクション "health" の生成
    const healthCollectionRef = collection(docRef, subcollectionNames.users[1]);
    const healthDocRef = await addDoc(healthCollectionRef, {
        heightCm: 170,
        weightKg: 60,
        drinkingHabit: "moderate",
        smokingStatus: "none",
        registeredAt: new Date(),
        updatedAt: new Date()
    });
    console.log(`サブコレクション "${subcollectionNames.users[1]}" を生成しました。`, healthDocRef.id);

    // 1-3. サブコレクション "dailyStatus" の生成
    const dailyStatusCollectionRef = collection(docRef, subcollectionNames.users[2]);
    const dailyStatusDocRef = await addDoc(dailyStatusCollectionRef, {
        location: new GeoPoint(35.6895, 139.6917),
        sleepHours: 7,
        createDate: new Date()
    });
    console.log(`サブコレクション "${subcollectionNames.users[2]}" を生成しました。`, dailyStatusDocRef.id);

    return docRef.id; // 生成したドキュメントのIDを返す
  } catch (e) { // エラー処理
    console.error("削除エラー", e);
    throw e;
  }
};

// 2.weatherDataコレクションの生成
async function createWetherData() {
  try {
    const docRef = await addDoc(collection(db, collectionNames[1]), {
        location: new GeoPoint(35.6895, 139.6917),
        forecastDate: new Date(),
        temperature: 25,
        humidity: 60,
        pressure: 1013,
        weather: "Sunny",
        pollenLevel: 1,
        pollenType: "Grass"
    });
    console.log(`コレクション "${collectionNames[1]}" を生成しました。`, docRef.id);

    return docRef.id; // 生成したドキュメントのIDを返す
  } catch (e) { // エラー処理
    console.error("削除エラー", e);
    throw e;
  }
};

// 3.aiInteractionsコレクションの生成
async function createAiInteractions() {
    try {
      const docRef = await addDoc(collection(db, collectionNames[2]), {
            recordId: "healthRecord000",
            userId: "testUser",
            GeneratedDate: new Date()
    });
    console.log(`コレクション "${collectionNames[2]}" を生成しました。`, docRef.id);

    // 3-1. サブコレクション "predictionAI" の生成
    const predictionAICollectionRef = collection(docRef, subcollectionNames.aiInteractions[0]);
    const predictionAIDocRef = await addDoc(predictionAICollectionRef, {
        headacheLevel: 1,
        pollinosisLevel: 1
    });
    console.log(`サブコレクション "${subcollectionNames.aiInteractions[0]}" を生成しました。`, predictionAIDocRef.id);

    // 3-2. サブコレクション "commentAI" の生成
    const commentAICollectionRef = collection(docRef, subcollectionNames.aiInteractions[1]);
    const commentAIDocRef = await addDoc(commentAICollectionRef, {
        emotion: "happy",
        comment: "You are in good condition today."
    });
    console.log(`サブコレクション "${subcollectionNames.aiInteractions[1]}" を生成しました。`, commentAIDocRef.id);

    return docRef.id; // 生成したドキュメントのIDを返す
  } catch (e) { // エラー処理
    console.error("削除エラー", e);
    throw e;
  }
};

// 全てのコレクションを削除

// 指定のドキュメントとそのサブコレクションを再帰的に削除する関数を作成
const deleteDocumentRecursively = async (docRef, subcollectionNames = []) => {
  // 既知のサブコレクションを取得して削除
  for (const subColName of subcollectionNames) {
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
      const subColNames = subcollectionNames[colName] || [];
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
  await createWetherData();
  await createAiInteractions();
}

export default { setupCollections }; // 外部で実行 & エラー処理
