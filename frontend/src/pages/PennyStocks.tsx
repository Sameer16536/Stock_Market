import React from "react";
import StockMultiLineChart from "../component/StockMultiLineChart";
import NavBar from "../component/Navbar";



const pennyStocks = [
    {
        name: "Vodafone Idea Ltd",
        symbol: "IDEA",
        price: 11.2,
        change: "+3.0%",
        data: [
            { time: "09:00 AM", price: 10.5 },
            { time: "10:00 AM", price: 11.0 },
            { time: "11:00 AM", price: 11.3 },
            { time: "12:00 PM", price: 11.1 },
            { time: "01:00 PM", price: 11.2 },
        ],
    },
    {
        name: "Suzlon Energy Ltd",
        symbol: "SUZLON",
        price: 8.5,
        change: "-1.5%",
        data: [
            { time: "09:00 AM", price: 8.6 },
            { time: "10:00 AM", price: 8.7 },
            { time: "11:00 AM", price: 8.5 },
            { time: "12:00 PM", price: 8.4 },
            { time: "01:00 PM", price: 8.5 },
        ],
    },
    {
        name: "Alok Industries Ltd",
        symbol: "ALOKINDS",
        price: 15.3,
        change: "+2.2%",
        data: [
            { time: "09:00 AM", price: 14.8 },
            { time: "10:00 AM", price: 15.0 },
            { time: "11:00 AM", price: 15.4 },
            { time: "12:00 PM", price: 15.2 },
            { time: "01:00 PM", price: 15.3 },
        ],
    },
];

const PennyStock = () => {
    return (
        <div className="min-h-screen bg-gray-50 ">
            <NavBar />
            <h1 className="text-2xl font-bold">Penny Stocks</h1>
            <p className="mt-2 text-gray-700">Track low-cost stocks with high potential returns.</p>
            <div className="mt-4">
                {/* Add specific charts and data visualization for penny stocks */}
                
                <StockMultiLineChart stocks={pennyStocks} />
            </div>
        </div>
    );
};

export default PennyStock;
