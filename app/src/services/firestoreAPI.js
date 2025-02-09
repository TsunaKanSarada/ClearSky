/**
 * @fileoverview Firestore データベースとのデータ入出力に関する関数群。
 * ClearSky/doc/specs/database_api.md に記載された仕様に基づく。
 */

import {
  collection,
  runTransaction,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  GeoPoint,
  Timestamp,
  getDoc,
  getDocs,
  query, // クエリ作成
  orderBy, // ソート条件
  limit, // 取得件数制限
  where, // フィルター条件
} from "firebase/firestore";
import { db } from "../firebase";
import { getCurrentUserUID } from "../auth";
import { collectionName, subCollectionNames } from "./databaseInit";

/**
 * @fileoverview Firestore データベースにデータを格納するための関数群。
 */

/**
 * ユーザーIDを Firestore に格納し、ユーザードキュメントを作成します。
 *
 * @function createUserDocument
 * @async
 * @throws {Error} ユーザーIDが取得できない場合、またはドキュメントの作成に失敗した場合にエラーをスローします。
 */
export async function createUserDocument() {
  try {
    const uid = getCurrentUserUID();
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
 * 初回登録時のプロフィール情報を Firestore に格納します。
 * users コレクションに ユーザーID をドキュメントIDとしてドキュメントを作成し、
 * 作成したドキュメントに プロフィール情報 と profile サブコレクションを追加します。
 *
 * @function storeFirstProfile
 * @async
 * @param {Object} profileData - 初回登録時のプロフィール情報。
 * @param {string} profileData.name - ユーザー名。
 * @param {number} profileData.character - キャラクター番号。
 * @param {Date} profileData.birthDate - 生年月日。
 * @param {number} profileData.gender - 性別 (数値)。
 * @param {number} profileData.heightCm - 身長 (cm)。
 * @param {number} profileData.weightKg - 体重 (kg)。
 * @param {number} profileData.DrinkingHabit - 飲酒習慣 (数値)。
 * @param {number} profileData.smokingHabit - 喫煙習慣 (数値)。
 * @throws {Error} ユーザーIDが取得できない場合、またはデータの格納に失敗した場合にエラーをスローします。
 */
export async function storeFirstProfile(profileData) {
  try {
    const uid = getCurrentUserUID();
    if (!uid) throw new Error("ユーザーIDが取得できません");
    const userDocRef = doc(db, collectionName, uid);
    const now = Timestamp.now();

    await runTransaction(db, async (transaction) => {
      transaction.set(userDocRef, {
        name: profileData.name,
        character: profileData.character,
      });

      const profileDocRef = doc(
        userDocRef,
        subCollectionNames.users[0],
        "profileDoc"
      );
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
 * プロフィール更新時の情報を Firestore に格納します。
 * users コレクションの ユーザーID をドキュメントIDとするドキュメント、
 * および profile サブコレクションのドキュメントを更新します。
 *
 * @function storeUpdateProfile
 * @async
 * @param {Object} profileData - 更新するプロフィール情報。
 * @param {string} profileData.name - ユーザー名。
 * @param {number} profileData.character - キャラクター番号。
 * @param {Date} profileData.birthDate - 生年月日。
 * @param {number} profileData.gender - 性別 (数値)。
 * @param {number} profileData.heightCm - 身長 (cm)。
 * @param {number} profileData.weightKg - 体重 (kg)。
 * @param {number} profileData.DrinkingHabit - 飲酒習慣 (数値)。
 * @param {number} profileData.smokingHabit - 喫煙習慣 (数値)。
 * @throws {Error} ユーザーIDが取得できない場合、またはデータの更新に失敗した場合にエラーをスローします。
 */
export async function storeUpdateProfile(profileData) {
  try {
    const uid = getCurrentUserUID();
    if (!uid) throw new Error("ユーザーIDが取得できません");
    const userDocRef = doc(db, collectionName, uid);
    const now = Timestamp.now();

    await runTransaction(db, async (transaction) => {
      transaction.update(userDocRef, {
        name: profileData.name,
        character: profileData.character,
      });

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

/**
 * 睡眠時間と入力時刻を Firestore に格納します。
 * usersコレクションの ユーザーID をドキュメントIDとするドキュメントの currentRecords フィールドを更新し、
 * dailyRecords サブコレクションに新しいドキュメントを追加します。
 *
 * @function storeSleepData
 * @async
 * @param {Object} sleepData - 睡眠データ。
 * @param {number} sleepData.sleepHours - 睡眠時間 (数値)。
 * @param {Date} sleepData.createdDate - 睡眠データの作成日時。
 * @throws {Error} ユーザーIDが取得できない場合、またはデータの格納に失敗した場合にエラーをスローします。
 */
export async function storeSleepData(sleepData) {
  try {
    const uid = getCurrentUserUID();
    if (!uid) throw new Error("ユーザーIDが取得できません");
    const userDocRef = doc(db, collectionName, uid);
    const now = Timestamp.now();

    await updateDoc(userDocRef, {
      "currentRecords.sleepHours": sleepData.sleepHours,
      "currentRecords.updatedAt": now,
    });

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
 * 位置情報を Firestore に格納します。
 * usersコレクションの ユーザーID をドキュメントIDとするドキュメントの currentRecords フィールドを更新し、
 * dailyRecords サブコレクションに新しいドキュメントを追加します。
 *
 * @function storeLocation
 * @async
 * @param {Object} location - 位置情報。
 * @param {number} location.latitude - 緯度。
 * @param {number} location.longitude - 経度。
 * @throws {Error} ユーザーIDが取得できない場合、またはデータの格納に失敗した場合にエラーをスローします。
 */
export async function storeLocation(location) {
  try {
    const uid = getCurrentUserUID();
    if (!uid) throw new Error("ユーザーIDが取得できません");
    const userDocRef = doc(db, collectionName, uid);

    await updateDoc(userDocRef, {
      "currentRecords.weather.location": new GeoPoint(location.latitude, location.longitude),
    });

    const dailyRecordsRef = collection(userDocRef, subCollectionNames.users[1]);
    await addDoc(dailyRecordsRef, {
      weather: {
        location: new GeoPoint(location.latitude, location.longitude),
      },
    });
  } catch (error) {
    console.error("位置情報の格納に失敗しました:", error);
    throw new Error("位置情報の格納に失敗しました");
  }
}

/**
 * 天気データを Firestore に格納します。
 * usersコレクションの ユーザーID をドキュメントIDとするドキュメントの currentRecords フィールドを更新し、
 * dailyRecords サブコレクションに新しいドキュメントを追加します。
 *
 * @function storeWeatherData
 * @async
 * @param {Object} weatherData - 天気情報。
 * @param {Date} weatherData.forecastDate - 予報日。
 * @param {number} weatherData.weatherCode - 天気コード。
 * @param {number} weatherData.temperatureMax - 最高気温。
 * @param {number} weatherData.temperatureMin - 最低気温。
 * @param {number} weatherData.apparentTemperatureMax - 体感最高気温。
 * @param {number} weatherData.apparentTemperatureMin - 体感最低気温。
 * @param {number} weatherData.humidity - 湿度。
 * @param {number} weatherData.pressure - 気圧。
 * @param {number} weatherData.windSpeed - 風速。
 * @param {number} [weatherData.uv] - UVインデックス (オプション)。
 * @throws {Error} ユーザーIDが取得できない場合、またはデータの格納に失敗した場合にエラーをスローします。
 */
export async function storeWeatherData(weatherData) {
  try {
    const uid = getCurrentUserUID();
    if (!uid) throw new Error("ユーザーIDが取得できません");
    const userDocRef = doc(db, collectionName, uid);

    const weatherDataToStore = {
      forecastDate: Timestamp.fromDate(weatherData.forecastDate),
      weatherCode: weatherData.weatherCode,
      temperatureMax: weatherData.temperatureMax,
      temperatureMin: weatherData.temperatureMin,
      apparentTemperatureMax: weatherData.apparentTemperatureMax,
      apparentTemperatureMin: weatherData.apparentTemperatureMin,
      humidity: weatherData.humidity,
      pressure: weatherData.pressure,
      windSpeed: weatherData.windSpeed,
      ...(weatherData.uv !== undefined && { uv: weatherData.uv }),
    };

    await updateDoc(userDocRef, {
      "currentRecords.weather": {
        ...weatherDataToStore,
        location: userDocRef.currentRecords?.weather?.location || null,
      },
    });

    const dailyRecordsRef = collection(userDocRef, subCollectionNames.users[1]);
    await addDoc(dailyRecordsRef, {
      weather: weatherDataToStore,
      createdDate: Timestamp.fromDate(weatherData.forecastDate),
    });
  } catch (error) {
    console.error("天気情報の格納に失敗しました:", error);
    throw new Error("天気情報の格納に失敗しました");
  }
}

/**
 * 頭痛予測AIの出力結果を Firestore に格納します。
 * usersコレクションの ユーザーID をドキュメントIDとするドキュメントの currentRecords フィールドを更新し(当日のみ)、
 * dailyRecords サブコレクションに新しいドキュメントを追加します。
 *
 * @function storePredictionData
 * @async
 * @param {Object} predictionData - 頭痛予測データ。
 * @param {number} predictionData.headacheLevel - 頭痛レベル。
 * @param {Date} generatedDate - 予測データの生成日
 * @throws {Error} ユーザーIDが取得できない場合、またはデータの格納に失敗した場合にエラーをスローします。
 */
export async function storePredictionData(predictionData, generatedDate) {
    try {
        const uid = getCurrentUserUID();
        if (!uid) throw new Error("ユーザーIDが取得できません");
        const userDocRef = doc(db, collectionName, uid);

        // currentRecords への更新 (当日のみ)
        await updateDoc(userDocRef, {
            "currentRecords.ai.prediction": {
                headacheLevel: predictionData.headacheLevel,
                GeneratedDate: generatedDate, // 引数の generatedDateを使う
            },
        });
        


        // dailyRecords サブコレクションへ新たに追加
        const dailyRecordsRef = collection(userDocRef, subCollectionNames.users[1]);
        await addDoc(dailyRecordsRef, {
            ai: {
                prediction: {
                    headacheLevel: predictionData.headacheLevel,
                    GeneratedDate: generatedDate, // 引数の generatedDateを使う
                },
            },
            createdDate: generatedDate, // generatedDateをcreatedDateにも使う
        });
    } catch (error) {
        console.error("偏頭痛予測AIデータの格納に失敗しました:", error);
        throw new Error("偏頭痛予測AIデータの格納に失敗しました");
    }
}

/**
 * アシスタントAIの応答を Firestore に格納します。
 * usersコレクションの ユーザーID をドキュメントIDとするドキュメントの currentRecords フィールドを更新し、
 * dailyRecords サブコレクションに新しいドキュメントを追加します。
 *
 * @function storeAssistantData
 * @async
 * @param {Object} assistantData - アシスタントAIの応答データ。
 * @param {string} assistantData.emotion - AIアシスタントの感情。
 * @param {string} assistantData.comment - AIアシスタントのコメント。
 * @throws {Error} ユーザーIDが取得できない場合、またはデータの格納に失敗した場合にエラーをスローします。
 */
export async function storeAssistantData(assistantData) {
  try {
    const uid = getCurrentUserUID();
    if (!uid) throw new Error("ユーザーIDが取得できません");
    const userDocRef = doc(db, collectionName, uid);
    const now = Timestamp.now();

    await updateDoc(userDocRef, {
      "currentRecords.ai.assistant": {
        emotion: assistantData.emotion,
        comment: assistantData.comment,
        GeneratedDate: now,
      },
    });

    const dailyRecordsRef = collection(userDocRef, subCollectionNames.users[1]);
    await addDoc(dailyRecordsRef, {
      ai: {
        assistant: {
          emotion: assistantData.emotion,
          comment: assistantData.comment,
          GeneratedDate: now,
        },
      },
      createdDate: now, // assistantData に createdDate が含まれない場合、現在時刻を追加
    });
  } catch (error) {
    console.error("アシスタントの応答の格納に失敗しました:", error);
    throw new Error("アシスタントの応答の格納に失敗しました");
  }
}

/**
 * コメントAIの応答を Firestore に格納します。
 * usersコレクションの ユーザーID をドキュメントIDとするドキュメントの currentRecords フィールドを更新し、
 * dailyRecords サブコレクションに新しいドキュメントを追加します。
 *
 * @function storeCommentData
 * @async
 * @param {Object} commentData - コメントAIの応答データ。
 * @param {string} commentData.weather - 天気についてのコメント。
 * @param {string} commentData.condition - 体調についてのコメント。
 * @throws {Error} ユーザーIDが取得できない場合、またはデータの格納に失敗した場合にエラーをスローします。
 */
export async function storeCommentData(commentData) {
  try {
    const uid = getCurrentUserUID();
    if (!uid) throw new Error("ユーザーIDが取得できません");
    const userDocRef = doc(db, collectionName, uid);
    const now = Timestamp.now();

    await updateDoc(userDocRef, {
      "currentRecords.ai.comment": {
        weather: commentData.weather,
        condition: commentData.condition,
        GeneratedDate: now,
      },
    });

    const dailyRecordsRef = collection(userDocRef, subCollectionNames.users[1]);
    await addDoc(dailyRecordsRef, {
      ai: {
        comment: {
          weather: commentData.weather,
          condition: commentData.condition,
          GeneratedDate: now,
        },
      },
      createdDate: now, //commentDataにcreatedDateがない場合、現在時刻を追加
    });
  } catch (error) {
    console.error("コメントAIの応答の格納に失敗しました:", error);
    throw new Error("コメントAIの応答の格納に失敗しました");
  }
}

/**
 * ユーザーのキャラクター情報を取得します。
 *
 * @async
 * @function getCharacterInfo
 * @returns {Promise<{character: number}>} キャラクター番号を含むオブジェクト(1: ハムスター, 2: 猫, 3: 犬, 4: ペンギン, 5: モモンガ, 6: コアラ, 7: うさぎ, 8: パンダ)
 * @throws {Error} ユーザーIDが取得できない場合、またはユーザードキュメントが存在しない場合にエラーをスローします。
 */
export async function getCharacterInfo() {
    try {
      const uid = getCurrentUserUID();
      if (!uid) throw new Error("ユーザーIDが取得できません");
  
      const userDocRef = doc(db, collectionName, uid);
      const userDoc = await getDoc(userDocRef);
  
      if (!userDoc.exists()) {
        throw new Error("ユーザードキュメントが存在しません");
      }
  
      return { character: userDoc.data().character };
    } catch (error) {
      console.error("キャラクター情報の取得に失敗しました:", error);
      throw new Error("キャラクター情報の取得に失敗しました");
    }
  }
  
  
  /**
   * ユーザーのプロフィール情報を取得します。
   *
   * @async
   * @function getProfile
   * @returns {Promise<Object>} プロフィール情報を含むオブジェクト。
   *   - birthDate: 生年月日 (Date オブジェクト)
   *   - gender: 性別 (数値)
   *   - heightCm: 身長 (数値)
   *   - weightKg: 体重 (数値)
   *   - DrinkingHabit: 飲酒習慣 (数値)
   *   - smokingHabit: 喫煙習慣 (数値)
   *   - registeredAt: 登録日時 (Date オブジェクト)
   *   - updatedAt: 更新日時 (Date オブジェクト)
   * @throws {Error} ユーザーIDが取得できない場合、またはプロフィール情報の取得に失敗した場合にエラーをスローします。
   */
  export async function getProfile() {
      try {
          const uid = getCurrentUserUID();
          if (!uid) throw new Error("ユーザーIDが取得できません");
  
          const profileDocRef = doc(
              db,
              collectionName,
              uid,
              subCollectionNames.users[0],
              "profileDoc"
          );
          const profileDoc = await getDoc(profileDocRef);
  
          if (!profileDoc.exists()) {
              throw new Error("プロフィール情報が存在しません");
          }
  
          const data = profileDoc.data();
          return {
              birthDate: data.birthDate ? data.birthDate.toDate() : null,
              gender: data.gender,
              heightCm: data.heightCm,
              weightKg: data.weightKg,
              DrinkingHabit: data.DrinkingHabit,
              smokingHabit: data.smokingHabit,
              registeredAt: data.registeredAt ? data.registeredAt.toDate() : null,
              updatedAt: data.updatedAt ? data.updatedAt.toDate() : null
          };
      } catch (error) {
          console.error("プロフィール情報の取得に失敗しました:", error);
          throw new Error("プロフィール情報の取得に失敗しました");
      }
  }
  
  
  
  /**
   * ユーザーの最新の天気情報から位置情報を取得します。
   *
   * @async
   * @function getLocation
   * @returns {Promise<{location: GeoPoint|null}>} 位置情報（GeoPoint オブジェクト）。位置情報が存在しない場合は null。
   * @throws {Error} ユーザーIDが取得できない場合にエラーをスローします。
   */
  export async function getLocation() {
    try {
      const records = await getCurrentRecords();
      return { location: records.weather?.location || null };
    } catch (error) {
      console.error("位置情報の取得に失敗しました:", error);
      throw new Error("位置情報の取得に失敗しました");
    }
  }
  
  /**
   * 指定された開始日以降の指定された日数分の気象予報を取得します。
   *
   * @async
   * @function getWeatherForecast
   * @param {Date} startDate - 取得を開始する日付。
   * @param {number} days - 取得する日数。
   * @returns {Promise<Array<{date: Date, weather: {location: GeoPoint|null, forecastDate: Date|null, weatherCode: number|null, temperatureMax: number|null, temperatureMin: number|null, apparentTemperatureMax: number|null, apparentTemperatureMin: number|null, humidity: number|null, pressure: number|null, windSpeed: number|null, uv: number|null}}>>}
   *   指定された期間の気象予報データの配列。各要素は日付と気象情報オブジェクトを含む。
   *   - date: 予報日 (Date オブジェクト)。
   *   - weather: 気象情報オブジェクト。
   *     - location: 位置情報 (GeoPoint オブジェクトまたは null)。
   *     - forecastDate: 予報日 (Date オブジェクトまたは null)。
   *     - weatherCode: 天気コード (数値または null)。
   *     - temperatureMax: 最高気温 (数値または null)。
   *     - temperatureMin: 最低気温 (数値または null)。
   *     - apparentTemperatureMax: 体感最高気温 (数値または null)。
   *     - apparentTemperatureMin: 体感最低気温 (数値または null)。
   *     - humidity: 湿度 (数値または null)。
   *     - pressure: 気圧 (数値または null)。
   *     - windSpeed: 風速 (数値または null)。
   *     - uv: UVインデックス (数値または null)。
   * @throws {Error} Firestore からのデータ取得中にエラーが発生した場合にエラーをスローします。
   */
export async function getWeatherForecast(startDate, days) {
    try {
      const records = await getDailyRecords(days); // 指定された日数分のデータを取得
  
      const filteredRecords = records.filter(
        (record) => {
          return record.weather
            && record.weather.forecastDate
            && record.weather.forecastDate instanceof Date // Date型か確認
            && record.weather.forecastDate >= startDate;
        }
      );
  
      return filteredRecords.map((record) => ({
        date: record.weather.forecastDate, //Date型で返す
        weather: {
          ...record.weather,
          forecastDate: record.weather.forecastDate
            ? record.weather.forecastDate
            : null,
        },
      }));
    } catch (error) {
      console.error("気象情報の取得に失敗しました:", error);
      throw new Error("気象情報の取得に失敗しました");
    }
  }
  
  
  /**
   * 指定された日付の気象情報を取得します。
   *
   * @async
   * @function getWeatherForDate
   * @param {Date} date - 取得する気象情報の日付。
   * @returns {Promise<Object|null>} 指定された日付の気象情報オブジェクト。該当するデータが存在しない場合は null。
   *   - location: 位置情報 (GeoPoint オブジェクトまたは null)。
   *   - forecastDate: 予報日 (Date オブジェクトまたは null)。
   *   - weatherCode: 天気コード (数値または null)。
   *   - temperatureMax: 最高気温 (数値または null)。
   *   - temperatureMin: 最低気温 (数値または null)。
   *   - apparentTemperatureMax: 体感最高気温 (数値または null)。
   *   - apparentTemperatureMin: 体感最低気温 (数値または null)。
   *   - humidity: 湿度 (数値または null)。
   *   - pressure: 気圧 (数値または null)。
   *   - windSpeed: 風速 (数値または null)。
   *   - uv: UVインデックス (数値または null)。
   * @throws {Error} ユーザーIDが取得できない場合、または Firestore からのデータ取得中にエラーが発生した場合にエラーをスローします。
   */
  export async function getWeatherForDate(date) {
    try {
      const uid = getCurrentUserUID();
      if (!uid) throw new Error("ユーザーIDが取得できません");
  
      const recordsRef = collection(
        db,
        collectionName,
        uid,
        subCollectionNames.users[1]
      );
      const q = query(
        recordsRef,
        where(
          "createdDate",
          ">=",
          Timestamp.fromDate(new Date(date.setHours(0, 0, 0, 0)))
        ),
        where(
          "createdDate",
          "<",
          Timestamp.fromDate(new Date(date.setDate(date.getDate() + 1)))
        )
      );
  
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        return null;
      }
      const data = querySnapshot.docs[0].data();
  
      // weather オブジェクト内の forecastDate を Date 型に変換
      return data.weather
        ? {
            ...data.weather,
            forecastDate: data.weather.forecastDate
              ? data.weather.forecastDate.toDate()
              : null,
          }
        : null;
    } catch (error) {
      console.error("気象情報の取得に失敗しました:", error);
      throw new Error("気象情報の取得に失敗しました");
    }
  }
  
/**
 * 指定された開始日以前の指定された日数分の睡眠時間履歴を取得します。
 *
 * @async
 * @function getSleepHistory
 * @param {Date} endDate - 取得期間の終了日。
 * @param {number} days - 取得する日数。
 * @returns {Promise<Array<{date: Date, sleepHours: number|null}>>} 指定された期間の睡眠時間データの配列。
 *   各要素は日付と睡眠時間を含む。睡眠時間が記録されていない場合は null。
 * @throws {Error} Firestore からのデータ取得中にエラーが発生した場合にエラーをスローします。
 */
export async function getSleepHistory(endDate, days) {
    try {
      // endDate の時刻部分を 23:59:59.999 に設定 (その日の最後)
      const lastDate = new Date(endDate);
      lastDate.setHours(23, 59, 59, 999);
  
  
      // lastDate から days 日前の日付を計算
      const calculatedStartDate = new Date(lastDate);
      calculatedStartDate.setDate(lastDate.getDate() - days + 1); // +1 は当日を含めるため
      calculatedStartDate.setHours(0,0,0,0); // 開始日
  
      const records = await getDailyRecords(null, calculatedStartDate, lastDate); //getDailyRecordsを修正
  
      return records
        .filter(record => {
          const createdDate = record.createdDate instanceof Timestamp ? record.createdDate.toDate() : record.createdDate;
          return createdDate >= calculatedStartDate && createdDate <= lastDate
      })
        .map((record) => ({ // record.createdDate がすでに Date オブジェクトであるかどうかを確認
          date: record.createdDate instanceof Date ? record.createdDate : (record.createdDate ? record.createdDate.toDate() : null),
          sleepHours: record.sleepHours,
        }));
    } catch (error) {
      console.error("睡眠時間履歴の取得に失敗しました:", error);
      throw new Error("睡眠時間履歴の取得に失敗しました");
    }
  }
  
  
/**
 * 指定された日付の睡眠時間を取得します。
 * 指定された日付が今日の場合は currentRecords から、
 * そうでない場合は dailyRecords から取得します。
 *
 * @async
 * @function getSleepForDate
 * @param {Date} date - 取得する睡眠時間の日付。
 * @returns {Promise<{sleepHours: number|null, date: Date|null}>} 指定された日付の睡眠時間と、日付情報を含むオブジェクト
 *   - sleepHours: 睡眠時間 (数値または null)。
 *   - date: 今日の場合はupdatedAt(Date)、それ以外はcreatedDate(Date)。
 * @throws {Error} ユーザーIDが取得できない場合、または Firestore からのデータ取得中にエラーが発生した場合にエラーをスローします。
 */
export async function getSleepForDate(date) {
    try {
        const uid = getCurrentUserUID();
        if (!uid) throw new Error("ユーザーIDが取得できません");

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(date);
        targetDate.setHours(0,0,0,0);

        if (targetDate.getTime() === today.getTime()) {
            // 今日の場合は currentRecords から取得
            const userDocRef = doc(db, collectionName, uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists() || !userDoc.data().currentRecords) {
                return { sleepHours: null, date: null }; // currentRecords がない場合
            }
            const userData = userDoc.data();
            return {
                sleepHours: userData.currentRecords.sleepHours ?? null,
                date: userData.currentRecords.updatedAt ? userData.currentRecords.updatedAt.toDate() : null // updatedAt を返す
            };

        } else {
            // 今日の日付ではない場合は、dailyRecordsから取得
            const recordsRef = collection(
                db,
                collectionName,
                uid,
                subCollectionNames.users[1]
            );
            const q = query(
                recordsRef,
                where(
                    "createdDate",
                    ">=",
                    Timestamp.fromDate(new Date(date.setHours(0, 0, 0, 0)))
                ),
                where(
                    "createdDate",
                    "<",
                    Timestamp.fromDate(new Date(date.setDate(date.getDate() + 1)))
                )
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return { sleepHours: null, date: null }; // データがない場合
            }

            const data = querySnapshot.docs[0].data();
            return {
                sleepHours: data.sleepHours ?? null,
                date: data.createdDate ? data.createdDate.toDate() : null // createdDate を返す
            };
        }
    } catch (error) {
        console.error("睡眠時間の取得に失敗しました:", error);
        throw new Error("睡眠時間の取得に失敗しました");
    }
}

  
/**
 * 指定された開始日以降の指定された日数分の頭痛予測履歴を取得します。
 *
 * @async
 * @function getHeadachePredictions
 * @param {Date} startDate - 取得を開始する日付。
 * @param {number} days - 取得する日数。
 * @returns {Promise<Array<{date: Date, prediction: Object|null}>>} 指定された期間の頭痛予測データの配列。
 *  各要素は日付と頭痛予測オブジェクトを含む。予測が存在しない場合は null。
 * @throws {Error} Firestore からのデータ取得中にエラーが発生した場合にエラーをスローします。
 */
export async function getHeadachePredictions(startDate, days) {
    try {
      // startDate の時刻部分を 00:00:00.000 に設定
      const startDateBeginning = new Date(startDate);
      startDateBeginning.setHours(0, 0, 0, 0);
  
      // startDate から days 日後の日付を計算 (時刻は 23:59:59.999)
      const endDate = new Date(startDateBeginning);
      endDate.setDate(startDateBeginning.getDate() + days - 1); // 当日を含むため -1 はしない
      endDate.setHours(23, 59, 59, 999);
  
      // getDailyRecords を修正された呼び出し方で使う
      const records = await getDailyRecords(null, startDateBeginning, endDate);
      const filteredRecords = records.filter((record) => {
          const generatedDate = record.ai?.prediction?.GeneratedDate instanceof Timestamp ? record.ai.prediction.GeneratedDate.toDate() : (record.ai?.prediction?.GeneratedDate instanceof Date ? record.ai?.prediction?.GeneratedDate : null);
  
          return generatedDate && generatedDate >= startDateBeginning && generatedDate <= endDate;
      });
  
      return filteredRecords.map((record) => ({
        date: record.ai?.prediction?.GeneratedDate instanceof Date ? record.ai.prediction.GeneratedDate : record.ai.prediction.GeneratedDate.toDate(),
        prediction: record.ai?.prediction || null,
      }));
  
    } catch (error) {
      console.error("頭痛予測履歴の取得に失敗しました:", error);
      throw new Error("頭痛予測履歴の取得に失敗しました");
    }
  }
  
  /**
   * 最新の頭痛予測を取得します。
   *
   * @async
   * @function getLatestHeadachePrediction
   * @returns {Promise<Object|null>} 最新の頭痛予測オブジェクト。予測が存在しない場合は null。
   *   - headacheLevel: 頭痛レベル (数値または null)。
   *   - GeneratedDate: 予測生成日時 (Date オブジェクトまたは null)。
   * @throws {Error} Firestore からのデータ取得中にエラーが発生した場合にエラーをスローします。
   */
  export async function getLatestHeadachePrediction() {
    try {
      const uid = getCurrentUserUID();
      if (!uid) throw new Error("ユーザーIDが取得できません");
  
      const recordsRef = collection(db, collectionName, uid, subCollectionNames.users[1]);
      const q = query(recordsRef, orderBy("createdDate", "desc"), limit(1)); // 最新の1件を取得
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        return null;
      }
  
      const data = querySnapshot.docs[0].data();
      return data.ai?.prediction ? { // data.ai と data.ai.prediction の存在確認
        ...data.ai.prediction,
        GeneratedDate: data.ai.prediction.GeneratedDate ? data.ai.prediction.GeneratedDate.toDate() : null,
      } : null;
  
    } catch (error) {
      console.error("頭痛予測の取得に失敗しました:", error);
      throw new Error("頭痛予測の取得に失敗しました");
    }
  }
  
  
  /**
   * 最新のAIアシスタント情報を取得します。
   *
   * @async
   * @function getLatestAssistantInfo
   * @returns {Promise<Object|null>} 最新のAIアシスタント情報オブジェクト。アシスタント情報が存在しない場合は null。
   *   - emotion: AIアシスタントの感情 (数値または null)。
   *   - comment: AIアシスタントのコメント (文字列または null)。
   *   - GeneratedDate: コメント生成日時 (Date オブジェクトまたは null)。
   * @throws {Error} Firestore からのデータ取得中にエラーが発生した場合にエラーをスローします。
   */
  export async function getLatestAssistantInfo() {
    try {
        const uid = getCurrentUserUID();
        if (!uid) throw new Error("ユーザーIDが取得できません");

        const recordsRef = collection(db, collectionName, uid, subCollectionNames.users[1]);
        const q = query(recordsRef, orderBy("createdDate", "desc"), limit(1)); // 最新の1件
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }
        const data = querySnapshot.docs[0].data();
        return data.ai?.assistant ? { // data.ai と data.ai.assistantの存在確認
          ...data.ai.assistant,
          GeneratedDate: data.ai.assistant.GeneratedDate ? data.ai.assistant.GeneratedDate.toDate() : null,
        } : null;

    } catch (error) {
        console.error("アシスタント情報の取得に失敗しました:", error);
        throw new Error("アシスタント情報の取得に失敗しました");
    }
}
  
  /**
   * 最新のAIコメントを取得します。
   *
   * @async
   * @function getLatestAIComments
   * @returns {Promise<Object|null>} 最新のAIコメントオブジェクト。コメントが存在しない場合は null。
   *   - weather: 天気に関するコメント (文字列または null)。
   *   - condition: 体調に関するコメント (文字列または null)。
   *   - GeneratedDate: コメント生成日時 (Date オブジェクトまたは null)。
   * @throws {Error} Firestore からのデータ取得中にエラーが発生した場合にエラーをスローします。
   */
  export async function getLatestAIComments() {
    try {
        const uid = getCurrentUserUID();
        if (!uid) throw new Error("ユーザーIDが取得できません");
        const recordsRef = collection(db, collectionName, uid, subCollectionNames.users[1]);
        const q = query(recordsRef, orderBy("createdDate", "desc"), limit(1)); //最新の1件
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }
        const data = querySnapshot.docs[0].data();
        return data.ai?.comment ? { //data.aiとdata.ai.commentの存在確認
            ...data.ai.comment,
            GeneratedDate: data.ai.comment.GeneratedDate ? data.ai.comment.GeneratedDate.toDate() : null
        } : null;

    } catch (error) {
        console.error("AIコメントの取得に失敗しました:", error);
        throw new Error("AIコメントの取得に失敗しました");
    }
}
  
  /**
   * ユーザーの最新レコード(currentRecords)を取得するヘルパー関数。
   *
   *
* @async
 * @function getCurrentRecords
 * @returns {Promise<Object>} ユーザーの最新レコードオブジェクト。currentRecords が存在しない場合は空のオブジェクトを返します。
 *   - sleepHours: 睡眠時間 (数値または null)。
 *   - weather: 天気情報オブジェクト (または null)。
 *     - location: 位置情報 (GeoPoint オブジェクトまたは null)。
 *     - forecastDate: 予報日 (Date オブジェクトまたは null)。
 *     - weatherCode: 天気コード (数値または null)。
 *     - temperatureMax: 最高気温 (数値または null)。
 *     - temperatureMin: 最低気温 (数値または null)。
 *     - apparentTemperatureMax: 体感最高気温 (数値または null)。
 *     - apparentTemperatureMin: 体感最低気温 (数値または null)。
 *     - humidity: 湿度 (数値または null)。
 *     - pressure: 気圧 (数値または null)。
 *     - windSpeed: 風速 (数値または null)。
 *     - uv: UVインデックス (数値または null)。
 *   - ai: AI関連情報オブジェクト (または null)。
 *     - prediction: 頭痛予測オブジェクト (または null)。
 *       - headacheLevel: 頭痛レベル (数値または null)。
 *       - GeneratedDate: 予測生成日時 (Date オブジェクトまたは null)。
 *     - assistant: AIアシスタント情報オブジェクト (または null)。
 *       - emotion: AIアシスタントの感情 (数値または null)。
 *       - comment: AIアシスタントのコメント (文字列または null)。
 *       - GeneratedDate: コメント生成日時 (Date オブジェクトまたは null)。
 *     - comment: AIコメントオブジェクト (または null)。
 *       - weather: 天気に関するコメント (文字列または null)。
 *       - condition: 体調に関するコメント (文字列または null)。
 *       - GeneratedDate: コメント生成日時 (Date オブジェクトまたは null)。
 *   - updatedAt: 最終更新日時 (Date オブジェクトまたは null)。
 * @throws {Error} ユーザーIDが取得できない場合、またはユーザードキュメントが存在しない場合にエラーをスローします。
 */
async function getCurrentRecords() {
    const uid = getCurrentUserUID();
    if (!uid) throw new Error("ユーザーIDが取得できません");
  
    const userDocRef = doc(db, collectionName, uid);
    const userDoc = await getDoc(userDocRef);
  
    if (!userDoc.exists()) {
      throw new Error("ユーザードキュメントが存在しません");
    }
  
    const userData = userDoc.data();
    const currentRecords = userData.currentRecords || {};
  
    // currentRecords 内の Date 型のフィールドを変換
    return {
      sleepHours: currentRecords.sleepHours ?? null,
      weather: currentRecords.weather
        ? {
            ...currentRecords.weather,
            forecastDate: currentRecords.weather.forecastDate
              ? currentRecords.weather.forecastDate.toDate()
              : null,
          }
        : null,
      ai: currentRecords.ai
        ? {
            prediction: currentRecords.ai.prediction
              ? {
                  ...currentRecords.ai.prediction,
                  GeneratedDate: currentRecords.ai.prediction.GeneratedDate
                    ? currentRecords.ai.prediction.GeneratedDate.toDate()
                    : null,
                }
              : null,
            assistant: currentRecords.ai.assistant
              ? {
                  ...currentRecords.ai.assistant,
                  GeneratedDate: currentRecords.ai.assistant.GeneratedDate
                    ? currentRecords.ai.assistant.GeneratedDate.toDate()
                    : null,
                }
              : null,
            comment: currentRecords.ai.comment
              ? {
                  ...currentRecords.ai.comment,
                  GeneratedDate: currentRecords.ai.comment.GeneratedDate
                    ? currentRecords.ai.comment.GeneratedDate.toDate()
                    : null,
                }
              : null,
          }
        : null,
      updatedAt: currentRecords.updatedAt ? currentRecords.updatedAt.toDate() : null,
    };
  }
  
  /**
   * 指定された日数分のデイリーレコードを取得するヘルパー関数。
   *
   * @async
   * @function getDailyRecords
   * @param {number} days - 取得する日数。
   * @param {Date} [startDate] - 取得するレコードの開始日（オプション）。指定しない場合は、最新のレコードから `days` 件取得します。
   * @param {Date} [endDate] - 取得するレコードの終了日（オプション）。指定しない場合は、最新のレコードから `days` 件取得します。
   * @returns {Promise<Array<Object>>} デイリーレコードオブジェクトの配列。各レコードは以下のプロパティを含む。
   *   - id: ドキュメントID (文字列)。
   *   - createdDate: レコード作成日時 (Date オブジェクトまたは null)。
   *   - sleepHours: 睡眠時間 (数値または null)。
   *   - weather: 天気情報オブジェクト (または null)。
   *     - location: 位置情報 (GeoPoint オブジェクトまたは null)。
   *     - forecastDate: 予報日 (Date オブジェクトまたは null)。
   *     - weatherCode: 天気コード (数値または null)。
   *     - temperatureMax: 最高気温 (数値または null)。
   *     - temperatureMin: 最低気温 (数値または null)。
   *     - apparentTemperatureMax: 体感最高気温 (数値または null)。
   *     - apparentTemperatureMin: 体感最低気温 (数値または null)。
   *     - humidity: 湿度 (数値または null)。
   *     - pressure: 気圧 (数値または null)。
   *     - windSpeed: 風速 (数値または null)。
   *     - uv: UVインデックス (数値または null)。
   *   - ai: AI関連情報オブジェクト (または null)。
   *     - prediction: 頭痛予測オブジェクト (または null)。
   *       - headacheLevel: 頭痛レベル (数値または null)。
   *       - GeneratedDate: 予測生成日時 (Date オブジェクトまたは null)。
   *     - assistant: AIアシスタント情報オブジェクト (または null)。
   *       - emotion: AIアシスタントの感情 (数値または null)。
   *       - comment: AIアシスタントのコメント (文字列または null)。
   *       - GeneratedDate: コメント生成日時 (Date オブジェクトまたは null)。
   *     - comment: AIコメントオブジェクト (または null)。
   *       - weather: 天気に関するコメント (文字列または null)。
   *       - condition: 体調に関するコメント (文字列または null)。
   *       - GeneratedDate: コメント生成日時 (Date オブジェクトまたは null)。
   * @throws {Error} ユーザーIDが取得できない場合、または Firestore からのデータ取得中にエラーが発生した場合にエラーをスローします。
   */
  export async function getDailyRecords(days, startDate, endDate) {
    const uid = getCurrentUserUID();
    if (!uid) throw new Error("ユーザーIDが取得できません");
  
    const recordsRef = collection(
      db,
      collectionName,
      uid,
      subCollectionNames.users[1]
    );
    let q = query(recordsRef, orderBy("createdDate", "desc")); // まず、日付で降順に並べる
  
    if (startDate) {
        const startTimestamp = startDate instanceof Date ? Timestamp.fromDate(startDate) : (startDate instanceof Timestamp ? startDate : Timestamp.fromDate(new Date(startDate)));
        q = query(q, where("createdDate", ">=", startTimestamp));
    }
    if(endDate) {
        const endTimestamp = endDate instanceof Date ? Timestamp.fromDate(endDate) : (endDate instanceof Timestamp ? endDate : Timestamp.fromDate(new Date(endDate)));
        q = query(q, where("createdDate", "<=", endTimestamp)); // 終了日以前
    }
    if(days){
        q = query(q, limit(days)); // 取得件数制限は最後
    }
  
    const querySnapshot = await getDocs(q);
  
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdDate: data.createdDate ? data.createdDate.toDate() : null,
        weather: data.weather
          ? {
              ...data.weather,
              forecastDate: data.weather.forecastDate
                ? data.weather.forecastDate.toDate()
                : null,
            }
          : null,
        ai: data.ai
          ? {
              prediction: data.ai.prediction
                ? {
                    ...data.ai.prediction,
                    GeneratedDate: data.ai.prediction.GeneratedDate
                      ? data.ai.prediction.GeneratedDate.toDate()
                      : null,
                  }
                : null,
              assistant: data.ai.assistant
                ? {
                    ...data.ai.assistant,
                    GeneratedDate: data.ai.assistant.GeneratedDate
                      ? data.ai.assistant.GeneratedDate.toDate()
                      : null,
                  }
                : null,
              comment: data.ai.comment
                ? {
                    ...data.ai.comment,
                    GeneratedDate: data.ai.comment.GeneratedDate
                      ? data.ai.comment.GeneratedDate.toDate()
                      : null,
                  }
                : null,
            }
          : null,
      };
    });
  }