import { 
    collection, 
    getDocs 
} from "firebase/firestore";
import { db } from "../firebase"; // Firestore の初期化

// Firestoreからデータを取得し、infopageコンポーネントで利用するためのデータ受け渡し関数
export const fetchInfoPageData = async () => {
    try {
      // 1. Firestoreから必要なデータを取得
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map((doc) => doc.data());
  
      const weatherDataCollection = collection(db, "weatherData");
      const weatherDataSnapshot = await getDocs(weatherDataCollection);
      const weatherData = weatherDataSnapshot.docs.map((doc) => doc.data());
  
      const aiInteractionsCollection = collection(db, "aiInteractions");
      const aiInteractionsSnapshot = await getDocs(aiInteractionsCollection);
      const aiInteractionsData = aiInteractionsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        predictionAI: (await getDocs(collection(doc.ref, "predictionAI"))).docs[0].data(), // predictionAIサブコレクションのデータを追加
        commentAI: (await getDocs(collection(doc.ref, "commentAI"))).docs[0].data(), // commentAIサブコレクションのデータを追加
      }));
  
      // 2. 取得したデータをinfopageコンポーネントで利用しやすい形式に加工
      const infoPageData = {
        users: usersData,
        weather: weatherData,
        aiInteractions: aiInteractionsData,
      };
  
      // 3. infopageコンポーネントにデータを渡す
      return infoPageData;
    } catch (error) {
      console.error("Error fetching data:", error);
      // エラー処理（例：エラーメッセージを表示、デフォルト値を返すなど）
      return {
        users: [],
        weather: [],
        aiInteractions: [],
      };
    }
  };