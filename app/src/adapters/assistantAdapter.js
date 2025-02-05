import { 
    collection, 
    getDocs 
  } from "firebase/firestore";
  import { db } from "../firebase"; // Firestore の初期化
  
  /* DBからデータを抽出し、フロントへ届けるファイル
  
  テーブルごとに関数で定義(？)
  DBから必要なデータを抽出し、uiAdapterへ関数として渡す
  
  <必要なデータ>
  
  ~playRoom~
  
  ・ユーザーのキャラクター情報
  ・ユーザーの短文体調コメント
  
  <commentAIに渡すデータ>
  ・アシスタントAIの持つユーザーの調子とコメント (assistantAI -> commentAI)
  
  
  ~assistant~
  
  ・ユーザーのキャラクター情報
  ・アシスタントAIの持つユーザーの調子とコメント
  
  <predictionAIに渡すデータ>
  ・気象情報 
  ・ユーザー情報 (health)
  
  <assistantAIに渡すデータ> ※これDBに必要か...？
  ・片頭痛レベル (predictionAI -> assistantAI)
  
  
  ~infoPage~
  ・ユーザーのキャラクター情報
  ・気象情報
  ・睡眠時間 
  ・気象情報への短文AIコメント
  
  <commentAIに渡すデータ>
  ・気象情報
  
  etc... 
  
  */
  
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