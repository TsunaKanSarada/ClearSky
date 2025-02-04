// エラー確認時にはHACKコメントを外して利用

import { useEffect } from "react";
import dbService from "../service/firestore/index"; // dbService をインポート

// ErrorLog コンポーネント：エラー処理の実行とログ出力
function ErrorLog() {
  useEffect(() => {
    async function runSetup() {
      try {
         await dbService.setupCollections(); // db の設定実行
      } catch (error) {
        console.error("Collections setup error:", error); // エラーログ出力
      }
    }
    runSetup();
  }, []);

  return (
    <div>
      {/* db設定のログ */}
      Collections の設定を実行中です。<br /> 
      
      エラーが発生した場合はコンソールをご確認ください。
    </div>
  );
}

// ErrorPage コンポーネント：エラーページとして表示
export default function ErrorPage() {
  return (
    <div>
      <h1>~Error Page~</h1>
      <ErrorLog />
    </div>
  );
}