/**
 * @fileoverview Firestore データベースの `getWeatherForecast`, `getSleepHistory`, `getSleepForDate`, `getHeadachePredictions` 関数の単体テストを行うコンポーネント。
 */
import { useState, useEffect } from 'react';
import * as dbAPI from "../services/firestore/databaseAPI"; // データ取得/書き込み関数
import * as dbInit from "../services/firestore/databaseInit"; // 初期化関数 (databaseInit.js) パスは適宜修正
import { getCurrentUserUID } from "../services/auth"; // 認証関連 (auth.js) パスは適宜修正
import { Timestamp } from 'firebase/firestore';

function DBGetTest() {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function runCombinedTests() {
      setLoading(true);
      let result = '';

      try {
        // 1. 既存のデータを全て削除
        result += "Deleting existing data...\n";
        await dbInit.deleteDocuments(dbInit.collectionName);
        result += "Data deletion complete.\n";

        // 2. テストユーザーの作成（最小限のデータ）
        result += "Creating initial user and profile data...\n";
        const uid = getCurrentUserUID();
        if (!uid) {
          throw new Error("User not logged in.");
        }
        await dbInit.setCollections(uid);
        result += "Initial data creation complete.\n";

        // 3. テストデータを作成 (過去7日、未来7日)
        result += "Creating test data...\n";
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = -7; i <= 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);

          // 天気データ
          const weatherData = {
            forecastDate: date,
            weatherCode: Math.floor(Math.random() * 100),
            temperatureMax: 25 + i,
            temperatureMin: 15 + i,
            apparentTemperatureMax: 22 + i,
            apparentTemperatureMin: 10 + i,
            humidity: 60 + i,
            pressure: 1013 + i,
            windSpeed: 3 + i,
            uv: 5 + i,
          };
          await dbAPI.storeLocation_WeatherData({ latitude: 35.6895, longitude: 139.6917 }, weatherData);

          // 睡眠データ
          await dbAPI.storeSleepData({ sleepHours: Math.floor(Math.random() * 5) + 4, createdDate: date }, Timestamp.fromDate(date) );

          // 頭痛予測データ
          await dbAPI.storePredictionData({ headacheLevel: Math.floor(Math.random() * 5) }, Timestamp.fromDate(date));
        }
        result += "Test data creation complete.\n";


        // 4. 各関数のテスト
        result += "Running tests...\n";
        const startDate = new Date(today);
        const days = 7;

        // getWeatherForecast
        const weatherForecast = await dbAPI.getWeatherForecast(startDate, days);
        result += `getWeatherForecast:\n${formatWeatherData(weatherForecast)}\n`;

        // getSleepHistory
        const sleepHistory = await dbAPI.getSleepHistory(startDate, days);
        result += `getSleepHistory:\n${formatSleepHistory(sleepHistory)}\n`;

        // getSleepForDate (今日)
        const todaySleep = await dbAPI.getSleepForDate(today);
        result += `getSleepForDate (Today): ${JSON.stringify(todaySleep)}\n`;

        // getSleepForDate (過去の日付)
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - 3);
        const pastSleep = await dbAPI.getSleepForDate(pastDate);
        result += `getSleepForDate (Past Date - ${pastDate.toLocaleDateString()}): ${JSON.stringify(pastSleep)}\n`;

        // getHeadachePredictions
        const headachePredictions = await dbAPI.getHeadachePredictions(startDate, days);
        result += `getHeadachePredictions:\n${formatHeadachePredictions(headachePredictions)}\n`;


      } catch (error) {
        result += `Test failed: ${error.message}\n`;
        console.error(error);

      } finally {
        setTestResult(result);
        setLoading(false);
      }
    }

    runCombinedTests();
  }, []);

    // 結果を整形するヘルパー関数 (weather)
    function formatWeatherData(forecast) {
        if (!forecast || forecast.length === 0) {
        return "    No data found.\n";
        }

        let formatted = "";
        forecast.forEach((item, index) => {
        formatted += `  Record ${index + 1}:\n`;
        formatted += `    Date: ${item.date.toISOString()}\n`;
        formatted += `    Weather: ${JSON.stringify(item.weather, null, 2)}\n`;
        });
        return formatted;
    }

    // 結果を整形するヘルパー関数(sleepHistory)
    function formatSleepHistory(history) {
        if (!history || history.length === 0) {
        return "    No data found.\n";
        }

        let formatted = "";
        history.forEach((item, index) => {
        formatted += `  Record ${index + 1}:\n`;
        formatted += `    Date: ${item.date.toISOString()}\n`;
        formatted += `    SleepHours: ${item.sleepHours}\n`;
        });
        return formatted;
    }

    // 結果を整形するヘルパー関数(headachePredictions)
    function formatHeadachePredictions(predictions) {
        if (!predictions || predictions.length === 0) {
        return "    No data found.\n";
        }

        let formatted = "";
        predictions.forEach((item, index) => {
        formatted += `  Record ${index + 1}:\n`;
        formatted += `    Date: ${item.date.toISOString()}\n`;
        formatted += `    Prediction: ${JSON.stringify(item.prediction)}\n`;
        });
        return formatted;
}

  return (
    <div>
      <h1>Combined Function Test</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <pre>{testResult}</pre>
      )}
    </div>
  );
}

export default DBGetTest;