import React, { useState } from "react";

import StockChart from "../component/StockChart";
import StockMultiLineChart from "../component/StockMultiLineChart";
import StockList from "../component/StockList";
import NavBar from "../component/Navbar";



const liveStocks = [
    {
        name: "Infosys Ltd",
        symbol: "INFY",
        price: 1450.2,
        change: "+1.2%",
        data: [
            { time: "09:00 AM", price: 1440 },
            { time: "10:00 AM", price: 1455 },
            { time: "11:00 AM", price: 1460 },
            { time: "12:00 PM", price: 1450 },
            { time: "01:00 PM", price: 1452 },
        ],
    },
    {
        name: "HDFC Bank Ltd",
        symbol: "HDFCBANK",
        price: 1650.8,
        change: "-0.8%",
        data: [
            { time: "09:00 AM", price: 1655 },
            { time: "10:00 AM", price: 1645 },
            { time: "11:00 AM", price: 1650 },
            { time: "12:00 PM", price: 1648 },
            { time: "01:00 PM", price: 1651 },
        ],
    },
    {
        name: "State Bank of India",
        symbol: "SBIN",
        price: 525.6,
        change: "+0.5%",
        data: [
            { time: "09:00 AM", price: 520 },
            { time: "10:00 AM", price: 522 },
            { time: "11:00 AM", price: 526 },
            { time: "12:00 PM", price: 527 },
            { time: "01:00 PM", price: 525 },
        ],
    },
];
const mockChartData = [
    { time: "09:00 AM", price: 300.5 },
    { time: "10:00 AM", price: 127.0 },
    { time: "11:00 AM", price: 700.5 },
    { time: "12:00 PM", price: 1000.0 },
    { time: "01:00 PM", price: 124.5 },
    { time: "03:00 PM", price: 125.0 },
    { time: "04:00 PM", price: 125.0 },
];


const LiveStocks = () => {
    const [selectedStock, setSelectedStock] = useState<string | null>(null);
    const [chartView, setChartView] = useState<"single" | "multi">("multi");

    const handleSwitch = () => {
        setChartView((prevView) => (prevView === "multi" ? "single" : "multi"));
    };

    const handleStockSelect = (stockName: string) => {
        setSelectedStock(stockName);
        setChartView("single");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar/>
            <div className="p-4">
                <h1 className="text-2xl font-bold">Live Stocks</h1>
                <button
                    onClick={handleSwitch}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    {chartView === "multi" ? "Switch to Single Stock View" : "Switch to Multi-Stock View"}
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="col-span-1">
                        <StockList onSelect={handleStockSelect} />
                    </div>
                    <div className="col-span-2">
                        {chartView === "multi" || !selectedStock ? (
                            <StockMultiLineChart stocks={liveStocks} />
                        ) : (
                            <StockChart stockName={selectedStock}  data={mockChartData}/>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveStocks;
