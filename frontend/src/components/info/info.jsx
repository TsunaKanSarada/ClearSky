import React from "react";
import RiskBar from "./riskbar";

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

// 日付文字列 (YYYY-MM-DD) を受け取り、日付のみと曜日 (例: 5(月)) を返すヘルパー関数
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const dayOfWeek = weekdays[date.getDay()];
  return `${day}(${dayOfWeek})`;
}

const Info = () => {
  const [dailyData, setDailyData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  // 初期値として現在のウィンドウの横幅を取得
  const [deviceWidth, setDeviceWidth] = React.useState(window.innerWidth);

  // ウィンドウサイズの変更を監視し、deviceWidth を更新する
  React.useEffect(() => {
    const handleResize = () => {
      setDeviceWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    // 東京付近の座標で、今後7日分の日別天気予報を取得
    // daily パラメータでは天気、気温、体感気温、風速、降水確率を、
    // hourly パラメータでは正午の相対湿度と気圧 (surface_pressure) を取得
    const url =
      "https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917" +
      "&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,wind_speed_10m_max,precipitation_probability_max" +
      "&hourly=relativehumidity_2m,surface_pressure" +
      "&forecast_days=7" +
      "&timezone=Asia%2FTokyo";

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("API の取得に失敗しました");
        }
        return response.json();
      })
      .then((data) => {
        const {
          time,
          weathercode,
          temperature_2m_max,
          temperature_2m_min,
          apparent_temperature_max,
          apparent_temperature_min,
          wind_speed_10m_max,
          precipitation_probability_max,
        } = data.daily;
        const hourlyTimes = data.hourly.time; // "YYYY-MM-DDThh:mm" の形式
        const hourlyHumidity = data.hourly.relativehumidity_2m;
        const hourlyPressure = data.hourly.surface_pressure;
        // 各配列のインデックスが対応している前提で、必要なデータをまとめる
        const days = time.map((date, index) => {
          // 正午のデータを取得（例: "2022-07-01T12:00"）
          const targetTime = `${date}T12:00`;
          const hourlyIndex = hourlyTimes.indexOf(targetTime);
          const humidity =
            hourlyIndex !== -1 ? Math.round(hourlyHumidity[hourlyIndex]) : "N/A";
          const pressure =
            hourlyIndex !== -1 ? Math.round(hourlyPressure[hourlyIndex]) : "N/A";
          return {
            date,
            weathercode: weathercode[index],
            temperature_max: Math.round(temperature_2m_max[index]),
            temperature_min: Math.round(temperature_2m_min[index]),
            // 体感気温も追加
            apparent_temperature_max: Math.round(apparent_temperature_max[index]),
            apparent_temperature_min: Math.round(apparent_temperature_min[index]),
            wind_speed: Math.round(wind_speed_10m_max[index]),
            humidity,
            precipitation: Math.round(precipitation_probability_max[index]),
            pressure,
          };
        });
        setDailyData(days);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ width: `${deviceWidth}px` }} className="mx-auto">
      {loading && <p>データを読み込み中...</p>}
      {error && (
        <p className="text-red-600">エラーが発生しました: {error.message}</p>
      )}
      {!loading && !error && dailyData.length === 0 && <p>天気データがありません。</p>}

      {!loading && !error && dailyData.length > 0 && (
        <>
          {/* 天気・気温等の情報表示 */}
          <div className="flex w-full">
            {dailyData.map((day) => (
              <div
                key={day.date}
                className="flex-1 border border-gray-300 rounded px-1 py-1 flex flex-col items-center"
              >
                <div className="w-full text-center text-xs border-b border-gray-300 pb-1">
                  {formatDate(day.date)}
                </div>
                <div className="flex flex-col items-center justify-center pt-1">
                  <span className="text-lg">{getWeatherIcon(day.weathercode)}</span>
                  <span className="text-xs mb-1">
                    <span className="text-red-500">{day.temperature_max}°</span>/
                    <span className="text-blue-500">{day.temperature_min}°</span>
                  </span>
                    <div className="text-center">
                        <div className="text-[8.8px]">体感温度</div>
                        <span className="text-xs mb-1">
                            <span className="text-red-500">{day.apparent_temperature_max}°</span>/
                            <span className="text-blue-500">{day.apparent_temperature_min}°</span>
                        </span>
                    </div>
                  <span className="text-[9px]">☔ {day.precipitation}%</span>
                  <span className="text-[9px]">💧 {day.humidity}%</span>
                  <span className="text-[9px]">🍃 {day.wind_speed}m</span>
                </div>
              </div>
            ))}
          </div>
        
          {/*
          <div className="mt-4">
            <h2 className="text-center text-lg">1週間の気圧 (hPa)</h2>
            <div className="flex w-full justify-around">
              {dailyData.map((day) => (
                <div key={day.date} className="text-center">
                  <div className="text-xs">{formatDate(day.date)}</div>
                  <div className="text-sm font-medium">{day.pressure}</div>
                </div>
              ))}
            </div>
          </div>
          */}
          <RiskBar value={20} />
          <RiskBar value={20} />
          <RiskBar value={20} />
        </>
      )}
    </div>
  );
};

export default Info;
