import { model } from "../firebase"; // Vertex AI モデルの初期化


/* <必要データの策定> (1.フロントへ送る / 2.データベースへ格納)

1.playRoom: [マップ上に漂うキャラクター(３体)の上にコメントを表示する]
・assistantAIの持つユーザーの調子とコメント -> getLatestAssistantInfo()
※ 上から自分の分１つ、最新分２つを表示する

2.InfoPage: [画面上部に気象情報を総称したコメントを表示する]
・気象情報 (7日分) -> getWeatherForecast(startDate, days)

*/

export async function run() {
    // テキストを含むプロンプトを提供
    const prompt = "魔法のリュックサックについての物語を書いてください。";

    // テキスト出力を生成するため、generateContentをテキスト入力で呼び出す
    const result = await model.generateContent(prompt);

    const response = result.response;
    const text = response.text();
    console.log(text);
}

run();
