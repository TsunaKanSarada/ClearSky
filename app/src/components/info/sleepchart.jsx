import React from "react";
import { motion } from "framer-motion"; // アニメーション用（framer-motionを利用）
import Loading from "../loading";

const SleepChart = ({ pressureData }) => {
  // ダミーデータ：曜日ごとの睡眠時間（単位: 時間）
  const sleepData = [
    { day: "月", hours: 7 },
    { day: "火", hours: 6 },
    { day: "水", hours: 9 },
    { day: "木", hours: 5 },
    { day: "金", hours: 7 },
    { day: "土", hours: 9 },
    { day: "日", hours: 8 },
  ];

  // チャートの基本サイズと余白の設定
  const baseWidth = 400;
  const baseHeight = 200;
  const padding = 40;
  // Y軸を padding からさらに左に 10px ずらす（例: 40 - 10 = 30）
  const yAxisX = padding - 10;

  const n = sleepData.length;
  const xInterval = (baseWidth - 2 * padding) / (n - 1);

  // 睡眠時間グラフのデータポイント計算
  const maxSleepHours = Math.max(...sleepData.map((data) => data.hours));
  const sleepPoints = sleepData.map((data, index) => {
    const x = padding + index * xInterval;
    const y = baseHeight - padding - (data.hours / maxSleepHours) * (baseHeight - 2 * padding);
    return { x, y, day: data.day, hours: data.hours };
  });

  // 気圧データを棒グラフとして描画するための計算
  let pressureBars = null;
  if (pressureData && pressureData.length === n) {
    const minPressure = Math.min(...pressureData);
    const maxPressure = Math.max(...pressureData);
    const barWidth = 20;
    // ★ バーの高さの値を反転させるため、(pressure - minPressure) の代わりに (maxPressure - pressure) を使用
    const scalePressure = (pressure) =>
      ((maxPressure - pressure) / (maxPressure - minPressure)) * (baseHeight - 2 * padding);
    pressureBars = pressureData.map((pressure, index) => {
      const barHeight = scalePressure(pressure);
      const x = padding + index * xInterval - barWidth / 2;
      const y = baseHeight - padding - barHeight;
      return { x, y, barHeight, pressure, index };
    });
  }

  // sleepData 用の polyline の points 文字列を作成
  const sleepPolyline = sleepPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    // 外側コンテナ
    <div className="p-4 bg-gradient-to-br from-pink-50 to-yellow-50 rounded-xl shadow-lg">
      <svg width="100%" height="100%" viewBox={`0 0 ${baseWidth} ${baseHeight}`} className="rounded-xl">
        <defs>
          {/* グラデーション定義：上部は淡いピンク、下部は柔らかいオレンジ */}
          <linearGradient id="pressureGradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ff9a9e" />
            <stop offset="100%" stopColor="#fad0c4" />
          </linearGradient>
          {/* ドロップシャドウ用のフィルター */}
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#fca5a5" />
          </filter>
        </defs>

        {/* グラフのタイトル */}
        <text
          x={baseWidth / 2}
          y="20"
          textAnchor="middle"
          className="text-lg font-bold fill-pink-600"
        >
          1週間の睡眠時間と片頭痛リスク
        </text>

        {/* 軸の描画 */}
        {/* Y軸の位置を yAxisX に変更 */}
        <line x1={yAxisX} y1={padding} x2={yAxisX} y2={baseHeight - padding} stroke="#fbcfe8" strokeWidth="1" />
        <line x1={padding} y1={baseHeight - padding} x2={baseWidth - padding} y2={baseHeight - padding} stroke="#fbcfe8" strokeWidth="1" />

        {/* 気圧の棒グラフ（背景に淡いグラデーションとシャドウ、アニメーション追加） */}
        {pressureBars &&
          pressureBars.map((bar) => (
            <g key={`pressure-${bar.index}`}>
              <motion.rect
                x={bar.x}
                width={20}
                fill="url(#pressureGradient)"
                filter="url(#shadow)"
                opacity="0.7"
                initial={{ height: 0, y: baseHeight - padding }}
                animate={{ height: bar.barHeight, y: bar.y }}
                transition={{ duration: 1, ease: "easeInOut", delay: bar.index * 0.1 }}
              />
              <text x={bar.x + 10} y={bar.y - 5} textAnchor="middle" className="text-[9px] fill-gray-600">
                {bar.pressure}hPa
              </text>
            </g>
          ))}

        {/* 睡眠時間の折れ線グラフ（framer-motionで滑らかな描画アニメーション） */}
        <motion.polyline
          fill="none"
          stroke="#4ade80"
          strokeWidth="3"
          points={sleepPolyline}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* 各曜日のデータポイントとラベル */}
        {sleepPoints.map((p, index) => (
          <g key={`sleep-${index}`}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#4ade80"
              whileHover={{ scale: 1.3, fill: "#16a34a" }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <text x={p.x} y={baseHeight - padding + 15} textAnchor="middle" className="text-xs fill-gray-500">
              {p.day}
            </text>
            <text x={p.x} y={baseHeight - padding + 30} textAnchor="middle" className="text-xs fill-gray-500">
              {p.hours}h
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default SleepChart;
