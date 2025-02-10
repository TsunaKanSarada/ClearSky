/**
 * @fileoverview Firestore データベースとのデータ入出力に関する関数群をテストするためのコンポーネント。
 * ClearSky/doc/specs/database_api.md に記載された仕様に基づく。
 */

import { useState, useEffect } from 'react';
import * as dbAPI from "../services/firestoreAPI"; // ここは変更なし

function DBtest() {
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    async function runTests() {
      let result = '';

      // createUserDocument のテスト
      try {
        await dbAPI.createUserDocument();
        result += "createUserDocument: Success\n";
      } catch (error) {
        result += `createUserDocument: Error - ${error.message}\n`;
      }

      // storeFirstProfile のテスト
      const profileData = {
        name: "Test User",
        character: 1,
        birthDate: new Date('1990-01-01'),
        gender: 1,
        heightCm: 170,
        weightKg: 65,
        DrinkingHabit: 1,
        smokingHabit: 0
      };
      try {
        await dbAPI.storeFirstProfile(profileData);
        result += "storeFirstProfile: Success\n";
      } catch (error) {
        result += `storeFirstProfile: Error - ${error.message}\n`;
      }

      // storeUpdateProfile (事前にデータが存在する必要がある)
      const updateProfileData = {
        name: 'Updated Name',
        character: 2,
        birthDate: new Date('1992-03-15'),
        gender: 2,
        heightCm: 175,
        weightKg: 70,
        DrinkingHabit: 2,
        smokingHabit: 1,
      };
      try {
        await dbAPI.storeUpdateProfile(updateProfileData);
        result += "storeUpdateProfile: Success\n";
      } catch (error) {
        result += `storeUpdateProfile: Error - ${error.message}\n`;
      }

      // storeSleepData のテスト
      const sleepData = {
        sleepHours: 7.5,
        createdDate: new Date() //createdDateを追加
      };
      try {
        await dbAPI.storeSleepData(sleepData);
        result += "storeSleepData: Success\n";
      } catch (error) {
        result += `storeSleepData: Error - ${error.message}\n`;
      }

      // storeLocation_WeatherData のテスト
      const location = { latitude: 35.6895, longitude: 139.6917 };
      const weatherData = {
        forecastDate: new Date(),
        weatherCode: 1,
        temperatureMax: 25,
        temperatureMin: 15,
        apparentTemperatureMax: 27,
        apparentTemperatureMin: 13,
        humidity: 60,
        pressure: 1010,
        windSpeed: 5,
        uv: 7
      };
      try {
        await dbAPI.storeLocation_WeatherData(location, weatherData);
        result += 'storeLocation_WeatherData: Success\n';
      } catch (error) {
        result += `storeLocation_WeatherData: Error - ${error.message}\n`;
      }

      // storePredictionData のテスト
      const predictionData = {
        headacheLevel: 3,
      };
      try {
        await dbAPI.storePredictionData(predictionData);
        result += "storePredictionData: Success\n";
      } catch (error) {
        result += `storePredictionData: Error - ${error.message}\n`;
      }

      // storeAssistantData のテスト
      const assistantData = {
        emotion: "happy",
        comment: "Good weather today!",
      };
      try {
        await dbAPI.storeAssistantData(assistantData);
        result += "storeAssistantData: Success\n";
      } catch (error) {
        result += `storeAssistantData: Error - ${error.message}\n`;
      }

      // storeCommentData のテスト
      const commentData = {
        weather: "It's sunny!",
        condition: "Feeling great!",
      };
      try {
        await dbAPI.storeCommentData(commentData);
        result += 'storeCommentData: Success\n';
      } catch (error) {
        result += `storeCommentData: Error - ${error.message}\n`;
      }

      // getCharacterInfo のテスト
      try {
        const charInfo = await dbAPI.getCharacterInfo();
        result += `getCharacterInfo: Success - ${JSON.stringify(charInfo)}\n`;
      } catch (error) {
        result += `getCharacterInfo: Error - ${error.message}\n`;
      }

      // getLocationのテスト
      try {
        const locationInfo = await dbAPI.getLocation();
        result += `getLocation: Success - ${JSON.stringify(locationInfo)}\n`;
      } catch (error) {
        result += `getLocation: Error - ${error.message}\n`;
      }

      // getWeatherForecast のテスト
      try {
        const startDate = new Date();
        const days = 7;
        const forecast = await dbAPI.getWeatherForecast(startDate, days);
        result += `getWeatherForecast: Success - ${JSON.stringify(forecast)}\n`;
      } catch (error) {
        result += `getWeatherForecast: Error - ${error.message}\n`;
      }

      // getWeatherForDate のテスト
      try {
        const weather = await dbAPI.getWeatherForDate(new Date());
        result += `getWeatherForDate: Success - ${JSON.stringify(weather)}\n`;
      } catch (error) {
        result += `getWeatherForDate: Error - ${error.message}\n`;
      }

      // getSleepHistory のテスト
      try {
        const sleepHistory = await dbAPI.getSleepHistory(new Date(), 7);
        result += `getSleepHistory: Success - ${JSON.stringify(sleepHistory)}\n`;
      } catch (error) {
        result += `getSleepHistory: Error - ${error.message}\n`;
      }

      // getSleepForDate のテスト
      try {
        const sleepDataResult = await dbAPI.getSleepForDate(new Date());
        result += `getSleepForDate: Success - ${JSON.stringify(sleepDataResult)}\n`;
      } catch (error) {
        result += `getSleepForDate: Error - ${error.message}\n`;
      }

      // getHeadachePredictions のテスト
      try {
        const headachePredictions = await dbAPI.getHeadachePredictions(new Date(), 7);
        result += `getHeadachePredictions: Success - ${JSON.stringify(headachePredictions)}\n`;
      } catch (error) {
        result += `getHeadachePredictions: Error - ${error.message}\n`;
      }

      // getLatestHeadachePrediction のテスト
      try {
        const latestPrediction = await dbAPI.getLatestHeadachePrediction();
        result += `getLatestHeadachePrediction: Success - ${JSON.stringify(latestPrediction)}\n`;
      } catch (error) {
        result += `getLatestHeadachePrediction: Error - ${error.message}\n`;
      }

      // getLatestAssistantInfo のテスト
      try {
        const latestAssistant = await dbAPI.getLatestAssistantInfo();
        result += `getLatestAssistantInfo: Success - ${JSON.stringify(latestAssistant)}\n`;
      } catch (error) {
        result += `getLatestAssistantInfo: Error - ${error.message}\n`;
      }

      // getLatestAIComments のテスト
      try {
        const latestComments = await dbAPI.getLatestAIComments();
        result += `getLatestAIComments: Success - ${JSON.stringify(latestComments)}\n`;
      } catch (error) {
        result += `getLatestAIComments: Error - ${error.message}\n`;
      }

      // getProfile のテスト
      try {
        const profile = await dbAPI.getProfile();
        result += `getProfile: Success - ${JSON.stringify(profile)}\n`;
      } catch (error) {
        result += `getProfile: Error - ${error.message}\n`;
      }

      setTestResult(result);
    }

    runTests();
  }, []);

  return (
    <div>
      <h1>Database API Test</h1>
      <pre>{testResult}</pre>
    </div>
  );
}

export default DBtest;