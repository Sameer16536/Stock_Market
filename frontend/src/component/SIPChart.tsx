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
import NavBar from "./Navbar";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface SipChartProps {
    data: { [key: string]: any }[]; // Array of data objects
    xKey: string; // Key for the x-axis values
    yKey: string; // Key for the y-axis values
    labelKey?: string; // Optional key for dataset labels
    title?: string; // Chart title
}

const SipChart: React.FC<SipChartProps> = ({
    data,
    xKey,
    yKey,
    labelKey = "label", // Default to "label" if no labelKey is provided
    title = "Multi-Line Chart",
}) => {
    // Group data by labels for multi-line plotting
    const groupedData = data.reduce<{ [key: string]: { x: any; y: any }[] }>((acc, item) => {
        const label = item[labelKey] || "Default";
        if (!acc[label]) acc[label] = [];
        acc[label].push({ x: item[xKey], y: item[yKey] });
        return acc;
    }, {});

    // Prepare datasets for Chart.js
    const datasets = Object.keys(groupedData).map((label) => ({
        label,
        data: groupedData[label].map((point) => point.y), // Y-axis data
        borderColor: getRandomColor(),
        backgroundColor: getRandomColor(0.2),
        fill: true,
        tension: 0.3,
    }));

    // Prepare x-axis labels
    const labels = [...new Set(data.map((item) => item[xKey]))];

    const chartData = {
        labels, // X-axis labels
        datasets,
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
                    text: "Value",
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
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

export default SipChart;
