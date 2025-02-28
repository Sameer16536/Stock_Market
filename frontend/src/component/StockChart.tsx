import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StockChartProps {
  stockName: string;
  data: { time: string; price: number }[];
}

const StockChart: React.FC<StockChartProps> = ({ stockName, data }) => {
  // Prepare the data for the chart
  const chartData = {
    labels: data.map((point) => point.time), // X-axis (time)
    datasets: [
      {
        label: `${stockName} Price`,
        data: data.map((point) => point.price), // Y-axis (price)
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">{stockName} Price Trend</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default StockChart;
