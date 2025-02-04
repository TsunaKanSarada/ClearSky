import React from 'react';

const SleepChart = () => {
  // ダミーデータ：曜日ごとの睡眠時間（単位: 時間）
  const sleepData = [
    { day: '月', hours: 7 },
    { day: '火', hours: 6 },
    { day: '水', hours: 9 },
    { day: '木', hours: 5 },
    { day: '金', hours: 7 },
    { day: '土', hours: 9 },
    { day: '日', hours: 8 },
  ];

  // 最大の睡眠時間（グラフのスケールに利用）
  const maxHours = Math.max(...sleepData.map(data => data.hours));
  // 平均の睡眠時間を算出
  const avgHours = sleepData.reduce((sum, data) => sum + data.hours, 0) / sleepData.length;

  // SVG の基準サイズと余白の設定
  const baseWidth = 400; // viewBox の幅（内部計算用）
  const height = 200;
  const padding = 40;
  const n = sleepData.length;
  const xInterval = (baseWidth - 2 * padding) / (n - 1);

  // 各データポイントの座標を算出（viewBox 内の座標）
  const points = sleepData.map((data, index) => {
    const x = padding + index * xInterval;
    // Y座標は、上が 0 となるため反転。余白を考慮して計算
    const y = height - padding - (data.hours / maxHours) * (height - 2 * padding);
    return { x, y, day: data.day, hours: data.hours };
  });

  // polyline の points 属性用に座標を連結
  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    // コンテナは画面いっぱいに広がるように w-full を指定
    <div className="w-full p-2">
      {/* 幅は100%、内部の描画サイズは viewBox で指定 */}
      <svg width="100%" height={height} viewBox={`0 0 ${baseWidth} ${height}`} className="border">
        {/* グラフタイトルを SVG 内に埋め込み */}
        <text
          x={baseWidth / 2}
          y="20"
          textAnchor="middle"
          className="text-xl font-bold"
        >
          1週間の睡眠時間
        </text>

        {/* y軸：左側の線 */} 
        <line 
          x1={padding} 
          y1={padding} 
          x2={padding} 
          y2={height - padding} 
          stroke="black" 
          strokeWidth="1" 
        />
        {/* x軸：下側の線 */}
        <line 
          x1={padding} 
          y1={height - padding} 
          x2={baseWidth - padding} 
          y2={height - padding} 
          stroke="black" 
          strokeWidth="1" 
        />

        {/* Y軸のメモリラベル */}
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
          {maxHours}h
        </text>
        <text 
          x={padding - 10} 
          y={(padding + (height - padding)) / 2} 
          textAnchor="end" 
          className="text-xs"
        >
          {maxHours / 2}h
        </text>

        {/* 折れ線グラフ */}
        <polyline 
          fill="none" 
          stroke="blue" 
          strokeWidth="2" 
          points={polylinePoints}
        />

        {/* 各データポイントとラベル（曜日とその日の睡眠時間） */}
        {points.map((p, index) => (
          <g key={index}>
            <circle cx={p.x} cy={p.y} r="4" fill="blue" />
            {/* 曜日ラベル（x軸下部） */}
            <text 
              x={p.x} 
              y={height - padding + 15} 
              textAnchor="middle" 
              className="text-xs"
            >
              {p.day}
            </text>
            {/* 各曜日の睡眠時間ラベル */}
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
