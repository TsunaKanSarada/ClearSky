const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { getFirestore } = require("firebase-admin/firestore");
const { initializeApp } = require("firebase-admin/app");
const { VertexAI } = require('@google-cloud/vertexai');

// Firebase の初期化
initializeApp();

// Vertex AI の初期化
const vertexai = new VertexAI({
    project: 'clearsky-e412b',
    location: 'us-central1',
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
    region: 'us-central1',
    timeoutSeconds: 60,
}, async (event) => {
    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();
    
    // sleepHours に変更がない場合は早期リターン
    if (beforeData.currentRecords?.sleepHours === afterData.currentRecords?.sleepHours) {
        return null;  // 明示的に null を返す
    }

    const userId = event.params.userId;
    const db = getFirestore();
    
    try {
        // プロフィールデータの取得
        const profileSnapshot = await db.collection(`users/${userId}/profile`).get();
        const profileData = profileSnapshot.docs[0]?.data() || {};

        // 予測に必要なデータの構築
        const predictionData = {
            sleepHours: afterData.currentRecords.sleepHours,
            weather: afterData.currentRecords.weather,
            profile: {
                gender: profileData.gender,
                heightCm: profileData.heightCm,
                weightKg: profileData.weightKg,
                smokingHabit: profileData.smokingHabit,
                birthDate: profileData.birthDate,
                drinkingHabit: profileData.drinkingHabit
            }
        };

        console.log(predictionData);

        // Vertex AI に予測リクエスト
        const prompt = `
            以下のデータから、偏頭痛レベルを1〜5の値で予測してください。
            1は最も軽度であり、数値とともに徐々に症状が重くなり、5は最も重度を表します。

            以下データの詳細です: 
            {
                sleepHours: 睡眠時間(h),
                weather: 天気(天気コード（0: 快晴 ~ 99: 雷雨）),
                profile: {
                    gender: 性別 (0: 男性, 1: 女性, 2: その他),
                    heightCm: 身長(cm),
                    weightKg: 体重(kg),
                    smokingHabit: 喫煙習慣 (0: なし, 1: ほぼ毎日, 2: 週に数回, 3: 月に数回),
                    birthDate: 生年月日,
                    drinkingHabit: 飲酒習慣 (0: なし, 1: ほぼ毎日, 2: 週に数回, 3: 月に数回)
                }
            }
            
            注意：偏頭痛のなりやすさに関していくつかの注意点があります：
                - 女性は男性よりも高い傾向があります。
                - BMIが高いほど偏頭痛のなりやすさが高くなります。
                - 睡眠時間が短いほど偏頭痛のなりやすさが高くなります。
                - 喫煙習慣があるほど偏頭痛のなりやすさが高くなります。
                - 飲酒習慣があるほど偏頭痛のなりやすさが高くなります。
                - 気圧が高いほど偏頭痛のなりやすさが高くなります。

            データ: ${JSON.stringify(predictionData)}

            感情は以下の数値で表してください：
            1: なし
            2: 軽度
            3: 中度
            4: 重度
            5: 非常に重度

            回答は数字のみを返してください：
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
