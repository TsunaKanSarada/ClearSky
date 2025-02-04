import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

/**
 * RiskBar
 * 0~100 の数値を受け取り、バーの長さを可視化するコンポーネント
 *
 * @param {number} value - 0~100 のリスク値などを想定
 * @returns JSX.Element
 */
const RiskBar = ({ value }) => {
  // グラフ用のデータ
  const data = {
    labels: ["Risk"],
    datasets: [
      {
        label: "リスク値",
        data: [value], // ここに受け取った値を設定
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  // グラフのオプション設定
  const options = {
    indexAxis: "y", // バーを横向きに表示
    scales: {
      x: {
        // リスク値の最大を100に設定
        max: 100,
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: "300px", height: "120px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default RiskBar;

