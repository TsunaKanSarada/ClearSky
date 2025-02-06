/* APIやフロントからの情報をデータベースに格納するファイル
仕様書はこちら → ClearSky/doc/specs/database_api.md */

import {
  collection,
  runTransaction, // トランザクションのインポート
  doc,
  setDoc,
  addDoc,
  updateDoc,
  GeoPoint,
  Timestamp, // firestore専用の日時データ型
} from "firebase/firestore";
import { db } from "../firebase"; // Firestoreのインポート
import { getCurrentUserUID } from "../auth"; // 認証ユーザーの ID を取得するauth関数
import { collectionName, subCollectionNames } from ".";

/**
 * ユーザーIDをFirestoreへ格納し、ユーザードキュメントを作成
 * @param {string} uid - ユーザーID
 */
export async function createUserDocument() {
  try {
    const uid = getCurrentUserUID(); // ユーザーIDを取得
    if (!uid) throw new Error("ユーザーIDが取得できません");

    await setDoc(doc(db, collectionName, uid), {
      userId: uid,
    });
  } catch (error) {
    console.error("ユーザードキュメントの作成に失敗しました:", error);
    throw new Error("ユーザードキュメントの作成に失敗しました");
  }
}

/**
 * 初回登録時の情報を Firestore に格納
 * @param {{
 * name: string,
 * character: number,
 * birthDate: Date,
 * gender: number,
 * heightCm: number,
 * weightKg: number,
 * DrinkingHabit: number,
 * smokingHabit: number
 * }} profileData
 */

// 初回登録時
export async function storeFirstProfile(profileData) {
    try {
        const uid = getCurrentUserUID(); // ユーザーIDを取得
        if (!uid) throw new Error("ユーザーIDが取得できません");
        const userDocRef = doc(db, collectionName, uid);
        const now = Timestamp.now();

        // トランザクション処理
        await runTransaction(db, async (transaction) => {
            // user ドキュメントを設定
            transaction.set(userDocRef, {
                name: profileData.name,
                character: profileData.character,
            });

            // profile サブコレクションを設定
            const profileDocRef = doc(userDocRef, subCollectionNames.users[0], "profileDoc");
            transaction.set(profileDocRef, {
                birthDate: Timestamp.fromDate(profileData.birthDate),
                gender: profileData.gender,
                heightCm: profileData.heightCm,
                weightKg: profileData.weightKg,
                DrinkingHabit: profileData.DrinkingHabit,
                smokingHabit: profileData.smokingHabit,
                registeredAt: now,
                updatedAt: now,
            });
        });
    } catch (error) {
        console.error("アンケート結果が正しく送信されませんでした:", error);
        throw new Error("アンケート結果が正しく送信されませんでした");
    }
}

/**
 * プロフィール更新時の情報を Firestore に格納
 * @param {{
 * name: string,
 * character: number,
 * birthDate: Date,
 * gender: number,
 * heightCm: number,
 * weightKg: number,
 * DrinkingHabit: number,
 * smokingHabit: number
 * }} profileData
 */

// プロフィール更新時
export async function storeUpdateProfile(profileData) {
    try {
        const uid = getCurrentUserUID(); // ユーザーIDを取得
        if (!uid) throw new Error("ユーザーIDが取得できません");
        const userDocRef = doc(db, collectionName, uid);
        const now = Timestamp.now();

        // トランザクション処理
        await runTransaction(db, async (transaction) => {
            // user ドキュメントの更新
            transaction.update(userDocRef, {
                name: profileData.name,
                character: profileData.character,
            });

            // profile サブコレクションの更新
            const profileDocRef = doc(
                userDocRef,
                subCollectionNames.users[0],
                "profileDoc"
            );
            transaction.update(profileDocRef, {
                birthDate: Timestamp.fromDate(profileData.birthDate),
                gender: profileData.gender,
                heightCm: profileData.heightCm,
                weightKg: profileData.weightKg,
                DrinkingHabit: profileData.DrinkingHabit,
                smokingHabit: profileData.smokingHabit,
                updatedAt: now,
            });
        });
    } catch (error) {
        console.error("プロフィールの更新に失敗しました:", error);
        throw new Error("プロフィールの更新に失敗しました");
    }
}

/* ①~② 睡眠時間入力時に取得 + (日時も取得)
(sleepHours, ①updatedAt, ②CreatedDate) */

/**
 * 睡眠時間 + 入力時の時刻を Firestore に格納
 * - ユーザードキュメントの currentRecords フィールドに更新
 * - サブコレクション dailyRecords へ新たに保存
 *
 * @param {{
 *   sleepHours: number,
 * }} sleepData
 */
export async function storeSleepData(sleepData) {
  try {
    const uid = getCurrentUserUID(); // ユーザーIDを取得
    if (!uid) throw new Error("ユーザーIDが取得できません");
    const userDocRef = doc(db, collectionName, uid); // ユーザードキュメントの参照を取得
    const now = Timestamp.now();

    // currentRecords へキャッシュとして保存
    await updateDoc(userDocRef, {
      "currentRecords.sleepHours": sleepData.sleepHours,
      "currentRecords.updatedAt": now,
    });

    // dailyRecords サブコレクションへ新たに追加
    const dailyRecordsRef = collection(userDocRef, subCollectionNames.users[1]);
    await addDoc(dailyRecordsRef, {
      sleepHours: sleepData.sleepHours,
      createdDate: Timestamp.fromDate(sleepData.createdDate),
    });
  } catch (error) {
    console.error("睡眠データの格納に失敗しました:", error);
    throw new Error("睡眠データの格納に失敗しました");
  }
}

/**
 * 取得した位置情報、天気データを Firestore に格納
 * 
 * @param {{ latitude: number, longitude: number }} location - 位置情報
 * @param {{
*   forecastDate: Date,
*   weatherCode: number,
*   temperatureMax: number,
*   temperatureMin: number,
*   apparentTemperatureMax: number,
*   apparentTemperatureMin: number,
*   humidity: number,
*   pressure: number,
*   windSpeed: number,
* }} weatherData - 天気情報
*/
export async function storeLocation_WeatherData(location,weatherData) {
    try {
      const uid = getCurrentUserUID(); // ユーザーIDを取得
      if (!uid) throw new Error("ユーザーIDが取得できません");
      const userDocRef = doc(db, collectionName, uid); // ユーザードキュメントの参照を取得
  
      // currentRecords での最新天気情報更新
      await updateDoc(userDocRef, {
        "currentRecords.weather": {
          location: new GeoPoint(location.latitude, location.longitude),
          forecastDate: Timestamp.fromDate(weatherData.forecastDate),
          weatherCode: weatherData.weatherCode,
          temperatureMax: weatherData.temperatureMax,
          temperatureMin: weatherData.temperatureMin,
          apparentTemperatureMax: weatherData.apparentTemperatureMax,
          apparentTemperatureMin: weatherData.apparentTemperatureMin,
          humidity: weatherData.humidity,
          pressure: weatherData.pressure,
          windSpeed: weatherData.windSpeed,
        },
      });
  
      // dailyRecords サブコレクションに新しい天気情報を保存
      const dailyRecordsRef = collection(userDocRef, subCollectionNames.users[1]);
      await addDoc(dailyRecordsRef, {
        weather: {
          location: new GeoPoint(location.latitude, location.longitude),
          forecastDate: Timestamp.fromDate(weatherData.forecastDate),
          weatherCode: weatherData.weatherCode,
          temperatureMax: weatherData.temperatureMax,
          temperatureMin: weatherData.temperatureMin,
          apparentTemperatureMax: weatherData.apparentTemperatureMax,
          apparentTemperatureMin: weatherData.apparentTemperatureMin,
          humidity: weatherData.humidity,
          pressure: weatherData.pressure,
          windSpeed: weatherData.windSpeed,
        },
      });
    } catch (error) {
      console.error("天気・位置情報の格納に失敗しました:", error);
      throw new Error("天気・位置情報の格納に失敗しました");
    }
  }



/**
 * 予測AIの出力結果を Firestore に格納
 * @param {{
 *   headacheLevel: number,
 *   GeneratedDate: Date,
 * }} predictionData
 */
export async function storePredictionData(predictionData) {
    try {
        const uid = getCurrentUserUID(); // ユーザーIDを取得
        if (!uid) throw new Error("ユーザーIDが取得できません");
        const userDocRef = doc(db, collectionName, uid); // ユーザードキュメントの参照を取得
        
        // currentRecords への更新
        await updateDoc(userDocRef, {
            "currentRecords.prediction": {
                headacheLevel: predictionData.headacheLevel,
                GeneratedDate: Timestamp.fromDate(predictionData.GeneratedDate),
            },
        });

        // dailyRecords サブコレクションへ新たに追加
        const dailyRecordsRef = collection(userDocRef, subCollectionNames.users[1]);
        await addDoc(dailyRecordsRef, {
            ai: {
                prediction: {
                    headacheLevel: predictionData.headacheLevel,
                    GeneratedDate: Timestamp.fromDate(predictionData.GeneratedDate),
                }
            }
        });
    } catch (error) {
        console.error("偏頭痛予測AIデータの格納に失敗しました:", error);
        throw new Error("偏頭痛予測AIデータの格納に失敗しました");
    }
}

/**
 * アシスタントAIの応答を Firestore に格納
 * @param {{
 *   emotion: string,
 *   comment: string,
 *   GeneratedDate: Date,
 * }} assistantData
 */
export async function storeAssistantData(assistantData) {
    try {
        const uid = getCurrentUserUID(); // ユーザーIDを取得
        if (!uid) throw new Error("ユーザーIDが取得できません");
        const userDocRef = doc(db, collectionName, uid); // ユーザードキュメントの参照を取得
        
        // currentRecords への更新
        await updateDoc(userDocRef, {
            "currentRecords.assistant": {
                emotion: assistantData.emotion,
                comment: assistantData.comment,
                GeneratedDate: Timestamp.fromDate(assistantData.GeneratedDate),
            },
        });

        // dailyRecords サブコレクションへ新たに追加
        const dailyRecordsRef = collection(userDocRef, subCollectionNames.users[1]);
        await addDoc(dailyRecordsRef, {
            ai: {
                assistant: {
                    emotion: assistantData.emotion,
                    comment: assistantData.comment,
                    GeneratedDate: Timestamp.fromDate(assistantData.GeneratedDate),
                }
            }
        });
    } catch (error) {
        console.error("アシスタントの応答の格納に失敗しました:", error);
        throw new Error("アシスタントの応答の格納に失敗しました");
    }
}

/**
 * コメントAIの応答を Firestore に格納
 * @param {{
 *   comment: string,
 *   GeneratedDate: Date,
 * }} commentData
 */
export async function storeCommentData(commentData) {
    try {
        const uid = getCurrentUserUID(); // ユーザーIDを取得
        if (!uid) throw new Error("ユーザーIDが取得できません");
        const userDocRef = doc(db, collectionName, uid); // ユーザードキュメントの参照を取得
        
        // currentRecords への更新
        await updateDoc(userDocRef, {
            "currentRecords.comment": {
                comment: commentData.comment,
                GeneratedDate: Timestamp.fromDate(commentData.GeneratedDate),
            },
        });

        // dailyRecords サブコレクションへ新たに追加
        const dailyRecordsRef = collection(userDocRef, subCollectionNames.users[1]);
        await addDoc(dailyRecordsRef, {
            ai: {
                comment: {
                    comment: commentData.comment,
                    GeneratedDate: Timestamp.fromDate(commentData.GeneratedDate),
                }
            }
        });
    } catch (error) {
        console.error("コメントAIの応答の格納に失敗しました:", error);
        throw new Error("コメントAIの応答の格納に失敗しました");
    }
}