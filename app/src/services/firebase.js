import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Authentication
import { getFirestore } from "firebase/firestore"; // Firestore
import { getVertexAI, getGenerativeModel } from "firebase/vertexai";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase アプリの初期化
const app = initializeApp(firebaseConfig);

// 認証サービスの初期化
export const auth = getAuth(app);

// Firestore サービスの初期化
export const db = getFirestore(app);

// Vertex AI サービスの初期化
export const vertexAI = getVertexAI(app);

// Vertex AI モデルの初期化(設定)                    // 安定版(自動更新バージョン)
export const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });
