import React, { useState, useEffect } from "react";
import Loading from "../loading";
import * as dbAPI from "../../services/firestoreAPI"; // データ取得/書き込み関数
import SleepChart from "./sleepchart";
import AIImageWithComment from "./AIcomment";

// SDK のインポート
import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini API の初期化（コンポーネント外で初期化しておく）
const genAI = new GoogleGenerativeAI("AIzaSyBhwVVT_D9HiQSnrZs1KdQIT4p8bMoHrZ0");
console.log(import.meta.env.gemini_API_KEY)


// 天気コードに応じたアイコン（絵文字）を返すヘルパー関数
function getWeatherIcon(weathercode) {
  if (weathercode === 0) return "☀️"; // 晴れ
  if ([1, 2, 3].includes(weathercode)) return "⛅"; // 曇りがかった状態
  if ([45, 48].includes(weathercode)) return "🌫️"; // 霧
  if ([51, 53, 55, 56, 57].includes(weathercode)) return "🌦️"; // 霧雨
  if ([61, 63, 65, 80, 81, 82].includes(weathercode)) return "🌧️"; // 雨
  if ([66, 67].includes(weathercode)) return "🌧️❄️"; // 霧雨と凍結
  if ([71, 73, 75, 85, 86].includes(weathercode)) return "❄️"; // 雪
  if (weathercode === 77) return "❄️"; // 雪粒
  if ([95, 96, 99].includes(weathercode)) return "⛈️"; // 雷雨
  return "❓";
}

// 日付文字列 (YYYY-MM-DD) を受け取り、日付と曜日 (例: 5(月)) を返すヘルパー関数
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const dayOfWeek = weekdays[date.getDay()];
  return `${day}(${dayOfWeek})`;
}

const Info = () => {
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 非同期関数を定義して即時実行
    const fetchWeather = async () => {
      const today = new Date();
      console.log("今日の日付:", today);
      try {
        const weather = await dbAPI.getWeatherForDate(today);
        console.log(weather);
      } catch (error) {
        console.error("天気情報の取得に失敗しました:", error);
      }
    };

    fetchWeather();
  }, []);

  // Gemini の回答用 state
  const [geminiComment, setGeminiComment] = useState("");

  // 画面サイズを state で管理
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const [deviceHeight, setDeviceHeight] = useState(window.innerHeight);

  // ウィンドウサイズの変更を監視
  useEffect(() => {
    const handleResize = () => {
      setDeviceWidth(window.innerWidth);
      setDeviceHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 天気情報取得用の useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 位置情報の取得
        const locationResult = await dbAPI.getLocation();
        let latitude, longitude;
        console.log("位置情報:", locationResult);
        if (
          locationResult &&
          locationResult.location &&
          typeof locationResult.location._lat !== "undefined" &&
          typeof locationResult.location._long !== "undefined"
        ) {
          // GeoPoint の内部プロパティ _lat と _long を利用
          latitude = locationResult.location._lat;
          longitude = locationResult.location._long;
        } else {
          // 位置情報が取得できない、または undefined の場合は東京の座標を使用
          latitude = 35.6895;
          longitude = 139.6917;
          console.log("位置情報が存在しない、または undefined です。フォールバック: 東京座標を使用");
        }

        console.log("位置情報:", { latitude, longitude });
        // open‑meteo API の URL を動的な座標で作成
        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
          "&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,wind_speed_10m_max,precipitation_probability_max,uv_index_max" +
          "&hourly=relativehumidity_2m,surface_pressure" +
          "&forecast_days=7" +
          "&timezone=Asia%2FTokyo";

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("API の取得に失敗しました");
        }
        const data = await response.json();

        const {
          time,
          weathercode,
          temperature_2m_max,
          temperature_2m_min,
          apparent_temperature_max,
          apparent_temperature_min,
          wind_speed_10m_max,
          precipitation_probability_max,
          uv_index_max,
        } = data.daily;

        const hourlyTimes = data.hourly.time; // "YYYY-MM-DDThh:mm" の形式
        const hourlyHumidity = data.hourly.relativehumidity_2m;
        const hourlyPressure = data.hourly.surface_pressure;

        // 日ごとのデータに整形
        const days = time.map((date, index) => {
          // 正午のデータ（例: "YYYY-MM-DDT12:00"）を取得
          const targetTime = `${date}T12:00`;
          const hourlyIndex = hourlyTimes.indexOf(targetTime);
          const humidity =
            hourlyIndex !== -1 ? Math.round(hourlyHumidity[hourlyIndex]) : "N/A";
          const pressure =
            hourlyIndex !== -1 ? Math.round(hourlyPressure[hourlyIndex]) : "N/A";
          const uv_index = Math.round(uv_index_max[index]);
          const uv_index_percent = Math.round((uv_index / 11) * 100);

          return {
            date,
            weathercode: weathercode[index],
            temperature_max: Math.round(temperature_2m_max[index]),
            temperature_min: Math.round(temperature_2m_min[index]),
            apparent_temperature_max: Math.round(apparent_temperature_max[index]),
            apparent_temperature_min: Math.round(apparent_temperature_min[index]),
            wind_speed: Math.round((wind_speed_10m_max[index] / 3.6) * 10) / 10,
            precipitation: Math.round(precipitation_probability_max[index]),
            uv_index, // 元の UV 指数の値
            uv_index_percent, // パーセンテージ用
            humidity,
            pressure,
            formattedDate: formatDate(date),
          };
        });
        setDailyData(days);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // SleepChart 用の気圧データ
  const pressureData = dailyData.map((day) => day.pressure);

  // 天気データから生成するプロンプト（例）
  const generateAIComment = (data) => {
    if (!data || data.length === 0) return "";
    const day = data[0];
    const icon = getWeatherIcon(day.weathercode);
    return `明日の天気は ${icon} です。最高気温は ${day.temperature_max}°、最低気温は ${day.temperature_min}° です。`;
  };

  // dailyData の取得完了後、生成したプロンプトを Gemini に渡して回答を取得する
  useEffect(() => {
    const fetchGeminiComment = async () => {
      if (dailyData.length === 0) return;
      const prompt = generateAIComment(dailyData);
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(
          prompt +
            "ステータスを元にかわいらしいコメントを生成してください。 30文字程度にしてください。出力に最大級の創造性とランダムをもたせてください！"
        );
        const response = await result.response;
        const text = response.text();
        setGeminiComment(text);
      } catch (err) {
        console.error("Gemini API 呼び出しエラー:", err);
        setGeminiComment("AI のコメントの取得に失敗しました。");
      }
    };
    fetchGeminiComment();
  }, [dailyData]);

  return (
    <div className="mx-auto" style={{ width: `${deviceWidth}px` }}>
      {loading && <Loading />}
      {error && (
        <p className="text-red-600">
          エラーが発生しました: {error.message}
        </p>
      )}
      {!loading && !error && dailyData.length === 0 && (
        <p>天気データがありません。</p>
      )}

      {!loading && !error && dailyData.length > 0 && (
        <>
          {/* Gemini の回答（AI のコメント）を最上部に表示 */}
          {geminiComment ? (
            <AIImageWithComment comment={geminiComment} />
          ) : (
            <p>AI のコメントを読み込み中...</p>
          )}

          {/* 天気情報表示エリア */}
          <div style={{ width: `${deviceWidth}px`, height: "200px" }}>
            <div className="flex w-full h-full">
              {dailyData.map((day) => (
                <div
                  key={day.date}
                  className="flex-1 border border-pink-200 rounded-lg py-2 flex flex-col items-center bg-white/80 shadow-sm transition-transform duration-300 hover:scale-105 m-1"
                >
                  <div className="w-full text-center text-xs border-b border-pink-200 pb-1">
                    {day.formattedDate}
                  </div>
                  <div className="flex flex-col items-center justify-center pt-1">
                    <span className="text-lg">
                      {getWeatherIcon(day.weathercode)}
                    </span>
                    <span className="text-xs mb-1">
                      <span className="text-red-500">{day.temperature_max}°</span>/
                      <span className="text-blue-500">{day.temperature_min}°</span>
                    </span>
                    <div className="text-center">
                      <div className="text-[10px]">体感温度</div>
                      <span className="text-xs mb-1">
                        <span className="text-red-500">
                          {day.apparent_temperature_max}°
                        </span>
                        /
                        <span className="text-blue-500">
                          {day.apparent_temperature_min}°
                        </span>
                      </span>
                    </div>
                    <span className="text-[10px]">☔ {day.precipitation}%</span>
                    <span className="text-[10px]">💧 {day.humidity}%</span>
                    <span className="text-[10px]">🍃 {day.wind_speed}m</span>
                    <span className="text-[10px]">
                      🔆 {day.uv_index_percent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SleepChart コンポーネント */}
          <div style={{ height: "35%" }}>
            <SleepChart pressureData={pressureData} />
          </div>
        </>
      )}
    </div>
  );
};

export default Info;
