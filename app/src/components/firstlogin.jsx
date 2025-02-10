import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Firestore の位置情報・睡眠データ保存関数、そして天気情報保存関数をインポート
import * as dbAPI from "../services/firestoreAPI"; // storeLocation, storeSleepData, storeWeatherData などの関数

const SleepTimeAndLocation = () => {
  const navigate = useNavigate();

  // 睡眠時間（送信データとしては 1～10 の数値）
  const [sleepTime, setSleepTime] = useState(1);
  // 送信中の状態管理用ステート
  const [loading, setLoading] = useState(false);
  // ユーザーへのフィードバック用メッセージ
  const [message, setMessage] = useState("");

  // 1時間～10時間までの選択肢
  const sleepOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  // navigator.geolocation.getCurrentPosition を Promise で扱う関数
  const getCurrentPositionPromise = () =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

  // フォーム送信時の処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // 保存用の睡眠データ作成
    const sleepData = {
      sleepHours: sleepTime,
      createdDate: new Date(),
    };

    try {
      let latitude, longitude;
      // Geolocation API が利用可能な場合
      if ('geolocation' in navigator) {
        try {
          // 位置情報の取得
          const position = await getCurrentPositionPromise();
          ({ latitude, longitude } = position.coords);
          // 位置情報保存処理
          await dbAPI.storeLocation(position.coords);
          console.log('位置情報保存成功:', { latitude, longitude });

          // ★ open‑meteo API を使用して天気情報を取得 ★
          const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
            `&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,wind_speed_10m_max,precipitation_probability_max,uv_index_max` +
            `&timezone=Asia%2FTokyo`;
          const weatherResponse = await fetch(weatherUrl);
          if (!weatherResponse.ok) {
            throw new Error("天気情報の取得に失敗しました");
          }
          const weatherData = await weatherResponse.json();
          console.log("天気情報取得成功:", weatherData);
          // ※ 必要に応じて、weatherData を state に保存したり、画面表示に利用してください。

          // ★ 取得した天気情報を Firestore に格納 ★
          // ※ open‑meteo の daily プロパティには各パラメータが配列で格納されているので、ここでは先頭（今日または最初の予報）の値を使用しています。
          try {
            const daily = weatherData.daily;
            if (daily && daily.time && daily.time.length > 0) {
              const weatherRecord = {
                // forecastDate は、daily.time[0] の日付文字列を Date オブジェクトに変換
                forecastDate: new Date(daily.time[0]),
                weatherCode: daily.weathercode[0],
                temperatureMax: daily.temperature_2m_max[0],
                temperatureMin: daily.temperature_2m_min[0],
                apparentTemperatureMax: daily.apparent_temperature_max[0],
                apparentTemperatureMin: daily.apparent_temperature_min[0],
                // ※ open‑meteo では湿度の値は取得できないため、ここでは precipitation_probability_max を代用しています
                humidity: daily.precipitation_probability_max[0],
                // pressure（気圧）は API から取得できないため、例として標準大気圧 1013 hPa を設定しています
                pressure: 1013,
                windSpeed: daily.wind_speed_10m_max[0],
                // uv は存在すれば設定（存在しない場合は undefined のまま）
                uv: daily.uv_index_max ? daily.uv_index_max[0] : undefined,
              };
              await dbAPI.storeWeatherData(weatherRecord);
              console.log("天気データ保存成功:", weatherRecord);
            } else {
              console.error("天気データの形式が不正です");
            }
          } catch (storeWeatherError) {
            console.error("天気データの保存に失敗しました:", storeWeatherError);
            // ※ 天気情報の保存に失敗しても、位置情報取得や睡眠データ保存には影響を与えない設計です
          }
        } catch (geoError) {
          console.error('位置情報の取得に失敗しました:', geoError);
          // 位置情報の取得に失敗しても、睡眠データは引き続き保存
          setMessage("位置情報の取得に失敗しましたが、睡眠データは保存されました。");
        }
      } else {
        console.log('Geolocation APIがこのブラウザでサポートされていません。');
        setMessage("Geolocation APIがサポートされていませんが、睡眠データは保存されました。");
      }

      // 睡眠データの保存処理
      await dbAPI.storeSleepData(sleepData);
      console.log('睡眠データ保存成功:', sleepData);
      setMessage("データが正常に保存されました。");

      // データ保存後に /home へ遷移
      navigate("/home");
    } catch (error) {
      console.error('データ保存中にエラーが発生しました:', error);
      setMessage("データ保存中にエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-purple-200">
      {/* ヘッダー画像部分 */}
      <div className="mb-6 animate-fadeInSlow">
        <div className="relative w-40 h-40 mx-auto flex items-center justify-center bg-pink-200 rounded-full ring-4 ring-white">
          <img
            src="images/1.png"
            alt="かわいいイラスト"
            className="w-3/4 h-3/4 object-contain rounded-full animate-bounce-once"
          />
        </div>
      </div>

      {/* フォーム部分 */}
      <div className="w-full max-w-md py-6 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl animate-fadeInSlow">
        <h2 className="text-2xl font-bold mb-4 text-pink-600 text-center">
          今日の睡眠は何時間？
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 睡眠時間選択 */}
          <div>
            <div className="grid grid-cols-5 gap-1 justify-center">
              {sleepOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSleepTime(option)}
                  disabled={loading}
                  className={`py-2 rounded-full border transition-all transform focus:outline-none ${
                    sleepTime === option
                      ? 'bg-pink-400 text-white border-pink-300 shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-pink-100 hover:border-pink-200'
                  }`}
                >
                  {option}時間
                </button>
              ))}
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-pink-500 hover:bg-pink-400 text-white font-medium px-8 py-2 rounded-full shadow-md transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '送信中...' : '送信'}
            </button>
          </div>
        </form>

        {/* ユーザーメッセージ */}
        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>

      {/* アニメーション用スタイル */}
      <style>
        {`
          /* 1回だけバウンドするアニメーション */
          @keyframes bounceOnce {
            0%   { transform: translateY(0); }
            30%  { transform: translateY(-40px); }
            50%  { transform: translateY(0); }
            70%  { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }
          .animate-bounce-once {
            animation: bounceOnce 1.5s ease-in-out;
          }

          /* ゆっくりフェードインするアニメーション */
          @keyframes fadeInSlow {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          .animate-fadeInSlow {
            animation: fadeInSlow 1.2s ease-in forwards;
          }

          /* ゆっくり回転するアニメーション */
          @keyframes spinSlow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spinSlow 4s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default SleepTimeAndLocation;
