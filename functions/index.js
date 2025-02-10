const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { getFirestore } = require("firebase-admin/firestore");
const { initializeApp } = require("firebase-admin/app");
const { VertexAI } = require('@google-cloud/vertexai');

// Firebase の初期化
initializeApp();

// Vertex AI の初期化
const vertexai = new VertexAI({
    project: 'clearsky-e412b',
    location: 'us-central1', // 日本リージョンに変更したい...！
});

// モデルとエンドポイントの設定
const model = 'gemini-pro';
const context = vertexai.preview.getGenerativeModel({
    model: model,
    generation_config: {
        max_output_tokens: 2048,
        temperature: 0.9,
        top_p: 1
    },
});

// 関数の定義
exports.processAIPrediction = onDocumentUpdated({
    document: "users/{userId}",
    region: 'us-central1', // 日本リージョンに変更したい...！
    timeoutSeconds: 60,
}, async (event) => {
    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();
    
    if (beforeData.currentRecords?.sleepHours === afterData.currentRecords?.sleepHours) {
        return null;
    }

    const userId = event.params.userId;
    const db = getFirestore();
    
    try {
        const profileRef = db.collection('users').doc(userId).collection('profile').doc('data'); // Firestoreの推奨構造に修正
        const profileSnapshot = await profileRef.get();
        const profileData = profileSnapshot.exists ? profileSnapshot.data() : {};

        const predictionData = {
            sleepHours: afterData.currentRecords.sleepHours,
            weather: {
                temperatureMax: afterData.currentRecords.temperatureMax,
                humidity: afterData.currentRecords.temperatureMax,
                pressure: afterData.currentRecords.pressure
            },
            profile: {
                birthDate: profileData.birthDate,
                gender: profileData.gender,
                heightCm: profileData.heightCm,
                weightKg: profileData.weightKg,
                smokingHabit: profileData.smokingHabit,
                DrinkingHabit: profileData.DrinkingHabit
            }

        };

        console.log(predictionData);

        // Vertex AI に予測リクエスト
        const prompt = `
            あなたは、個人の生活習慣や体質データ、気候条件に基づいて、24時間以内の片頭痛発生リスクを予測するAIモデルです。
            以下の入力変数と計算式を使用し、計算例も参考にしつつ、片頭痛リスクスコアを計算してください。

            以下は入力変数の詳細です: 
            {
                sleepHours: 睡眠時間(h),
                weather: {
                    temperatureMax: 最高気温(℃),
                    humidity: 湿度(%),
                    pressure: 気圧(hPa)
                profile: {
                    birthDate: 生年月日,
                    gender: 性別 (0: 男性, 1: 女性, 2: その他),
                    heightCm: 身長(cm),
                    weightKg: 体重(kg),
                    smokingHabit: 喫煙習慣 (0: なし, 1: ほぼ毎日, 2: 週に数回, 3: 月に数回),
                    DrinkingHabit: 飲酒習慣 (0: なし, 1: ほぼ毎日, 2: 週に数回, 3: 月に数回)
                }
            }

            データ: ${JSON.stringify(predictionData)}

            以下は計算式の詳細です。
                - sleepHours = abs(8 - 睡眠時間) * 3.5
                - temperature = abs(15 - 気温) * 1
                - humidity = max(0, 湿度 - 70) * 1.5
                - pressure = max(0, 1013 - 気圧) * 2
                - age (今日の日付 - 生年月日) = if 年齢 < 10 then 2 else if 年齢 < 20 then 5 else if 年齢 < 50 then 10 else 3
                - gender = if 性別 == "女性" then 10 else 0
                - BMI ( weightKg / (heightCm/100) ^2 ) = max(0, BMI - 25) * 1
                - smokingHabit = if 喫煙習慣 == 1 then 8 else if 喫煙習慣 == 2 then 5 else if 喫煙習慣 == 3 then 3 else 0 
                - DrinkingHabit = if 飲酒習慣 == 1 then 5 else if 飲酒習慣 == 2 then 3 else if 飲酒習慣 == 3 then 1 else 0


        計算例：
            今日の日付を2024年1月1日**とした場合のある30歳女性 (性別=女性)、BMI=27、睡眠時間=6時間、気圧=1015hPa、喫煙習慣=2: 週に数回、飲酒習慣=2: 週に数回、気温=28℃、湿度=80% の場合：

            S = abs(8 - 6) * 3.5 = 7
            T = abs(15 - 28) * 1 = 13
            H = max(0, 80 - 70) * 1.5 = 15
            P = max(0, 1013 - 1015) * 2 = 0
            Ag = if 年齢 < 50 then 10 else ... = 10
                年齢計算: 今日の日付(2024年1月1日) - 生年月日(1994年1月1日と仮定) = 30歳
            G = 10 (女性なので)
            B = max(0, 27 - 25) * 1 = 2
            Sm = if 喫煙習慣 == 2 then 5 else ... = 5
            A = if 飲酒習慣 == 2 then 3 else ... = 3
            Bias = 15
            リスクスコア R = (0.8 * 7) + (0.3 * 13) + (0.2 * 15) + (0.5 * 0) + (0.6 * 10) + (0.7 * 10) + (0.6 * 2) + (0.9 * 5) + (0.4 * 3) + 15
            = 5.6 + 3.9 + 3 + 0 + 6 + 7 + 1.2 + 4.5 + 1.2 + 15 = 47.4  

            リスクスコアは以下の数値で表してください：
            0: リスクなし ~ 100: 非常に高いリスク
        `;

        const result = await context.generateContent(prompt);
        const response = await result.response;
        const headacheLevel = parseInt(response.candidates[0].content.parts[0].text) || 1;

        // エージェントのコメントを生成
        const commentPrompt = `
            以下のデータを基に、ユーザーへのコメントを生成してください。
            データ: ${JSON.stringify(predictionData)}
            頭痛レベル: ${headacheLevel}

            以下の点を考慮して、'カンマ区切り(,)で'5種類のコメントを生成してください：
            - ユーザーの健康状態に配慮して感情豊かに
            - 睡眠時間や生活習慣に基づいて多角的に

            コメントのみを返してください：
        `;

        const commentResult = await context.generateContent(commentPrompt);
        const commentResponse = await commentResult.response;
        const agentComment = commentResponse.candidates[0].content.parts[0].text.trim() || "コメントなし";

        // 生成されたコメントに基づいて感情を判定
        const emotionPrompt = `
            以下のデータ・コメントを総括して、感情を数値で表現してください。

            データ: ${JSON.stringify(predictionData)}
            頭痛レベル: ${headacheLevel}
            コメント: "${agentComment}"

            感情は以下の数値で表してください：
            0: 楽しい
            1: うれしい
            2: 怒り
            3: 悲しみ
            4: 恐怖
            5: 疑問

            数値のみを返してください：
        `;

        const emotionResult = await context.generateContent(emotionPrompt);
        const emotionResponse = await emotionResult.response;
        const agentEmotion = parseInt(emotionResponse.candidates[0].content.parts[0].text.trim()) || 0;

        // 結果を保存
        await db.doc(`users/${userId}`).update({
            'currentRecords.ai.prediction': {
                headacheLevel: headacheLevel,
                GeneratedDate: new Date()
            },
            'currentRecords.ai.assistant': {
                comment: agentComment,
                emotion: agentEmotion,
                GeneratedDate: new Date()
            }
        });

        return null;

    } catch (error) {
        console.error('Error processing prediction:', error);
        return null;
    }
});
