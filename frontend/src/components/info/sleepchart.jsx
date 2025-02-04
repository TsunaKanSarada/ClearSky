import React from "react";

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
  const baseWidth = 400; // viewBox の幅（内部計算用）
  const height = 200;
  const padding = 40;
  const n = sleepData.length;
  const xInterval = (baseWidth - 2 * padding) / (n - 1);

  // 睡眠時間グラフのためのデータポイント計算
  const maxSleepHours = Math.max(...sleepData.map((data) => data.hours));
  const sleepPoints = sleepData.map((data, index) => {
    const x = padding + index * xInterval;
    // y 座標は、上が 0 となるため反転して計算
    const y =
      height -
      padding -
      (data.hours / maxSleepHours) * (height - 2 * padding);
    return { x, y, day: data.day, hours: data.hours };
  });

  // 気圧のデータが渡されており、sleepData と日数が合致する場合に棒グラフを描画
  let pressureBars = null;
  if (pressureData && pressureData.length === n) {
    const minPressure = Math.min(...pressureData);
    const maxPressure = Math.max(...pressureData);
    const barWidth = 20;
    // 気圧の値を棒グラフの高さに変換するスケール関数
    const scalePressure = (pressure) =>
      ((pressure - minPressure) / (maxPressure - minPressure)) *
      (height - 2 * padding);

    pressureBars = pressureData.map((pressure, index) => {
      const barHeight = scalePressure(pressure);
      // x 座標は睡眠グラフのデータポイントに合わせる（中央寄せ）
      const x = padding + index * xInterval - barWidth / 2;
      const y = height - padding - barHeight;
      return { x, y, barHeight, pressure };
    });
  }

  // sleepData 用の polyline の points 文字列を作成
  const sleepPolyline = sleepPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="w-full p-2">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${baseWidth} ${height}`}
        className="border"
      >
        {/* 気圧棒グラフ用のグラデーション定義（下が赤、上が明るい緑） */}
        <defs>
          <linearGradient id="pressureGradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="red" />
            <stop offset="100%" stopColor="limegreen" />
          </linearGradient>
        </defs>

        {/* グラフのタイトル */}
        <text
          x={baseWidth / 2}
          y="20"
          textAnchor="middle"
          className="text-xl font-bold"
        >
          1週間の睡眠時間と片頭痛リスク
        </text>

        {/* 軸の描画 */}
        {/* y 軸 */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="black"
          strokeWidth="1"
        />
        {/* x 軸 */}
        <line
          x1={padding}
          y1={height - padding}
          x2={baseWidth - padding}
          y2={height - padding}
          stroke="black"
          strokeWidth="1"
        />

        {/* 睡眠時間の y 軸ラベル */}
        <text
          x={padding - 10}
          y={height - padding + 5}
          textAnchor="end"
          className="text-xs"
        >
          0h
        </text>
        <text
          x={padding - 10}
          y={padding + 5}
          textAnchor="end"
          className="text-xs"
        >
          {maxSleepHours}h
        </text>
        <text
          x={padding - 10}
          y={(padding + (height - padding)) / 2}
          textAnchor="end"
          className="text-xs"
        >
          {Math.round(maxSleepHours / 2)}h
        </text>

        {/* 気圧の棒グラフ（sleepData の背景として描画） */}
        {pressureBars &&
          pressureBars.map((bar, index) => (
            <g key={`pressure-${index}`}>
              <rect
                x={bar.x}
                y={bar.y}
                width={20}
                height={bar.barHeight}
                fill="url(#pressureGradient)"
                stroke="black"
                strokeWidth="0.3"
                opacity="0.6"
              />
              {/* 棒の上部に気圧値のラベル */}
              <text
                x={bar.x + 10}
                y={bar.y - 5}
                textAnchor="middle"
                className="text-[9px]"
              >
                {bar.pressure}hPa
              </text>
            </g>
          ))}

        {/* 睡眠時間の折れ線グラフ */}
        <polyline
          fill="none"
          stroke="blue"
          strokeWidth="2"
          points={sleepPolyline}
        />

        {/* 各曜日のデータポイントとラベル */}
        {sleepPoints.map((p, index) => (
          <g key={`sleep-${index}`}>
            <circle cx={p.x} cy={p.y} r="4" fill="blue" />
            {/* x 軸下の曜日ラベル */}
            <text
              x={p.x}
              y={height - padding + 15}
              textAnchor="middle"
              className="text-xs"
            >
              {p.day}
            </text>
            {/* 睡眠時間の数値ラベル */}
            <text
              x={p.x}
              y={height - padding + 30}
              textAnchor="middle"
              className="text-xs text-gray-600"
            >
              {p.hours}h
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default SleepChart;
