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
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface StockMultiLineChartProps {
    stocks: {
        name: string;
        symbol: string;
        data: { time: string; price: number }[];
    }[];
}



const StockMultiLineChart: React.FC<StockMultiLineChartProps> = ({ stocks }) => {

    // Prepare the data for the multi-line chart
    const chartData = {
        labels: stocks[0]?.data.map((point) => point.time) || [], // X-axis labels (time)
        datasets: stocks.map((stock) => ({
            label: stock.name,
            data: stock.data.map((point) => point.price), // Y-axis data for each stock
            borderColor: getRandomColor(),
            backgroundColor: getRandomColor(0.2),
            fill: true,
            tension: 0.3,
        })),
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top" as const,
            },
            tooltip: {
                mode: "index" as const,
                intersect: false,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Time",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Price (₹)",
                },
                beginAtZero: false,
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Multi-Stock Price Trend</h2>
            <Line data={chartData} options={options} />
        </div>
    );
};

// Helper function to generate random colors
const getRandomColor = (opacity = 1) => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default StockMultiLineChart;
