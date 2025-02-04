import {
    collection,
    addDoc,
    /* getDoc, -> CRUD処理 未使用部分
    // updateDoc,
    deleteDoc, */
    GeoPoint // 座標データを扱うためのクラス
} from "firebase/firestore";
import { db } from "./firebase"; // Firestore の初期化

/* 構築手順
0.コレクションを全て削除 <未対応>
1.コレクション、フィールドを定義 (テストデータを追加する形式)
*/

// コレクション名称を定義
const collectionName = ["users", "weatherData", "aiInteractions"];
const subcollectionName = [
    ["profile", "health", "dailyStatus"], // users
    [""], // weatherData
    ["predictionAI", "commentAI"] // aiInteractions
];


// 1. コレクション "user" の生成
async function createUsers() {
  try {
    const docRef = await addDoc(collection(db, collectionName[0]), {
        userId: "testUser", 
        name: "testUser",
      });
    console.log("User document written with ID: ", docRef.id);

    // 1-1. サブコレクション "profile" の生成
    const profileCollectionRef = collection(docRef, subcollectionName[0][0]);
    const profileDocRef = await addDoc(profileCollectionRef, {
        birthDate: new Date("1990-01-01"),
        gender: "",
        registeredAt: new Date(),
        updatedAt: new Date()
    });
    console.log("Profile document written with ID: ", profileDocRef.id);

    // 1-2. サブコレクション "health" の生成
    const healthCollectionRef = collection(docRef, subcollectionName[0][1]);
    const healthDocRef = await addDoc(healthCollectionRef, {
        heightCm: 170,
        weightKg: 60,
        drinkingHabit: "moderate",
        smokingStatus: "none",
        registeredAt: new Date(),
        updatedAt: new Date()
    });
    console.log("health document written with ID: ", healthDocRef.id);

    // 1-3. サブコレクション "dailyStatus" の生成
    const dailyStatusCollectionRef = collection(docRef, subcollectionName[0][2]);
    const dailyStatusDocRef = await addDoc(dailyStatusCollectionRef, {
        location: new GeoPoint(35.6895, 139.6917),
        sleepHours: 7,
        createDate: new Date()
    });
    console.log("dailyStatus document written with ID: ", dailyStatusDocRef.id);

    return docRef.id; // 生成したドキュメントのIDを返す
  } catch (e) { // エラー処理
    console.error("Error adding user document: ", e);
    throw e;
  }
};

// 2.weatherDataコレクションの生成
async function createWetherData() {
  try {
    const docRef = await addDoc(collection(db, collectionName[1]), {
        location: new GeoPoint(35.6895, 139.6917),
        forecastDate: new Date(),
        temperature: 25,
        humidity: 60,
        pressure: 1013,
        weather: "Sunny",
        pollenLevel: 1,
        pollenType: "Grass"
    });
    console.log("Document written with ID: ", docRef.id);

    return docRef.id; // 生成したドキュメントのIDを返す
  } catch (e) { // エラー処理
    console.error("Error adding user document: ", e);
    throw e;
  }
};

// 3.aiInteractionsコレクションの生成
async function createAiInteractions() {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
            recordId: "healthRecord000",
            userId: "testUser",
            GeneratedDate: new Date()
    });
    console.log("Document written with ID: ", docRef.id);

    // 3-1. サブコレクション "predictionAI" の生成
    const predictionAICollectionRef = collection(docRef, subcollectionName[2][0]);
    const predictionAIDocRef = await addDoc(predictionAICollectionRef, {
        headacheLevel: 1,
        pollinosisLevel: 1
    });
    console.log("predictionAI document written with ID: ", predictionAIDocRef.id);

    // 3-2. サブコレクション "commentAI" の生成
    const commentAICollectionRef = collection(docRef, subcollectionName[2][1]);
    const commentAIDocRef = await addDoc(commentAICollectionRef, {
        emotion: "happy",
        comment: "You are in good condition today."
    });
    console.log("commentAI document written with ID: ", commentAIDocRef.id);

    return docRef.id; // 生成したドキュメントのIDを返す
  } catch (e) { // エラー処理
    console.error("Error adding user document: ", e);
    throw e;
  }
};

// コレクションの処理を一元化する
async function  setupCollections() {
  createUsers();
  createWetherData();
  createAiInteractions();
}

export default { setupCollections }; // 外部で実行 & エラー処理







/* -----------------------------
以下、CRUD処理 未使用部分のテンプレート(Read, Update, Delete) 


// データを取得
export const readDocument = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error getting document: ", e);
    throw e;
  }
};

// データを更新
export const updateDocument = async (collectionName, documentId, data) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, data);
    console.log("Document updated with ID: ", documentId);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

// データを削除
export const deleteDocument = async (collectionName, documentId) => {
  try {
    await deleteDoc(doc(db, collectionName, documentId));
    console.log("Document deleted with ID: ", documentId);
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};

*/
