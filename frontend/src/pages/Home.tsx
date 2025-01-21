import React, { useEffect, useState } from "react";
import StockList from "../component/StockList"
import StockChart from "../component/StockChart";
import StockMultiLineChart from "../component/StockMultiLineChart";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
// import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Modal } from "@mui/material";
import {Link, useNavigate} from 'react-router-dom'
import NavBar from "../component/Navbar";
import Index from "../component/Index";


const pages = ['Home', 'Live Stocks', 'Penny Stocks','Guide','SIP'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const mockChartData = [
    { time: "09:00 AM", price: 300.5 },
    { time: "10:00 AM", price: 127.0 },
    { time: "11:00 AM", price: 700.5 },
    { time: "12:00 PM", price: 1000.0 },
    { time: "01:00 PM", price: 124.5 },
    { time: "03:00 PM", price: 125.0 },
    { time: "04:00 PM", price: 125.0 },
];
const stocks = [
    {
        name: "Reliance Industries Ltd",
        symbol: "RELIANCE",
        price: 1244.1,
        change: "-10.0%",
        data: [
            { time: "09:00 AM", price: 1200 },
            { time: "10:00 AM", price: 1420 },
            { time: "11:00 AM", price: 1140 },
            { time: "12:00 PM", price: 1750 },
            { time: "01:00 PM", price: 2230 },
        ],
    },
    {
        name: "Tata Steel Ltd",
        symbol: "TATASTEEL",
        price: 122.94,
        change: "+2.5%",
        data: [
            { time: "09:00 AM", price: 120 },
            { time: "10:00 AM", price: 121 },
            { time: "11:00 AM", price: 123 },
            { time: "12:00 PM", price: 125 },
            { time: "01:00 PM", price: 124 },
        ],
    },
    {
        name: "Infosys Ltd",
        symbol: "INFY",
        price: 1968.85,
        change: "+0.5%",
        data: [
            { time: "09:00 AM", price: 1950 },
            { time: "10:00 AM", price: 1960 },
            { time: "11:00 AM", price: 1970 },
            { time: "12:00 PM", price: 1980 },
            { time: "01:00 PM", price: 1975 },
        ],
    },
    {
        name: "HDFC Bank Ltd",
        symbol: "HDFCBANK",
        price: 1589.7,
        change: "+1.2%",
        data: [
            { time: "09:00 AM", price: 1570 },
            { time: "10:00 AM", price: 1580 },
            { time: "11:00 AM", price: 1590 },
            { time: "12:00 PM", price: 1600 },
            { time: "01:00 PM", price: 1585 },
        ],
    },
    {
        name: "State Bank of India",
        symbol: "SBIN",
        price: 598.6,
        change: "-0.8%",
        data: [
            { time: "09:00 AM", price: 605 },
            { time: "10:00 AM", price: 600 },
            { time: "11:00 AM", price: 595 },
            { time: "12:00 PM", price: 590 },
            { time: "01:00 PM", price: 598 },
        ],
    },
    {
        name: "ICICI Bank Ltd",
        symbol: "ICICIBANK",
        price: 914.8,
        change: "+0.7%",
        data: [
            { time: "09:00 AM", price: 910 },
            { time: "10:00 AM", price: 912 },
            { time: "11:00 AM", price: 918 },
            { time: "12:00 PM", price: 920 },
            { time: "01:00 PM", price: 915 },
        ],
    },
    {
        name: "Bajaj Finance Ltd",
        symbol: "BAJFINANCE",
        price: 6514.2,
        change: "-1.1%",
        data: [
            { time: "09:00 AM", price: 6550 },
            { time: "10:00 AM", price: 6530 },
            { time: "11:00 AM", price: 6520 },
            { time: "12:00 PM", price: 6500 },
            { time: "01:00 PM", price: 6510 },
        ],
    },
    {
        name: "Mahindra & Mahindra Ltd",
        symbol: "M&M",
        price: 1450.3,
        change: "+1.5%",
        data: [
            { time: "09:00 AM", price: 1435 },
            { time: "10:00 AM", price: 1440 },
            { time: "11:00 AM", price: 1455 },
            { time: "12:00 PM", price: 1460 },
            { time: "01:00 PM", price: 1455 },
        ],
    },
    {
        name: "Asian Paints Ltd",
        symbol: "ASIANPAINT",
        price: 3056.7,
        change: "+0.3%",
        data: [
            { time: "09:00 AM", price: 3045 },
            { time: "10:00 AM", price: 3150 },
            { time: "11:00 AM", price: 3260 },
            { time: "12:00 PM", price: 3058 },
            { time: "01:00 PM", price: 3555 },
        ],
    },
    {
        name: "Reliance Power Ltd",
        symbol: "RPOWER",
        price: 13.25,
        change: "-5.0%",
        data: [
            { time: "09:00 AM", price: 13.8 },
            { time: "10:00 AM", price: 13.5 },
            { time: "11:00 AM", price: 13.2 },
            { time: "12:00 PM", price: 13.1 },
            { time: "01:00 PM", price: 13.25 },
        ],
    },
    {
        name: "Coal India Ltd",
        symbol: "COALINDIA",
        price: 230.5,
        change: "+2.3%",
        data: [
            { time: "09:00 AM", price: 225 },
            { time: "10:00 AM", price: 228 },
            { time: "11:00 AM", price: 231 },
            { time: "12:00 PM", price: 232 },
            { time: "01:00 PM", price: 230 },
        ],
    }

];
const indicesData = [
    {
        symbol: "NIFTY 50",
        ltp: 23344.75,
        percentageChange: "141.55 (0.61%)",
        timestamp: "2025-01-20T17:19:05.071Z",
    },
    {
        symbol: "NIFTY NEXT 50",
        ltp: 65106.15,
        percentageChange: "52.55 (0.08%)",
        timestamp: "2025-01-20T17:19:05.071Z",
    },
    {
        symbol: "NIFTY MIDCAP SELECT",
        ltp: 12356.5,
        percentageChange: "106.65 (0.87%)",
        timestamp: "2025-01-20T17:19:05.071Z",
    },
    {
        symbol: "NIFTY BANK",
        ltp: 49350.8,
        percentageChange: "810.20 (1.67%)",
        timestamp: "2025-01-20T17:19:05.071Z",
    },
    {
        symbol: "NIFTY FINANCIAL SERVICES",
        ltp: 22926.7,
        percentageChange: "318.50 (-1.41%)",
        timestamp: "2025-01-20T17:19:05.071Z",
    },
];


const Home = () => {
    const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [chartView, setChartView] = useState<"single" | "multi">("multi")
  const [isLoggedIn,setIsLoggedIn] = useState<boolean | null>(false)
  const [showModal, setShowModal] = useState<boolean | null>(false)
  const navigate = useNavigate()

    const handleSwitch = () => {
        setChartView((prevView) => (prevView === "multi" ? "single" : "multi"));
    };
    const handleStockSelect = (stockName: string) => {
        setSelectedStock(stockName);
        setChartView("single");
    };

  useEffect(() => {
    if (!isLoggedIn) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 5*60000); // 300,000 ms = 5 minutes

      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [isLoggedIn]);
  const handleLoginRedirect = () => {
    setShowModal(false);
    navigate("/login");
  };

    return (
        <div className="min-h-screen bg-gray-50">
      <NavBar />
            <main className="p-4">
                <button
                    onClick={handleSwitch}
                    className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    {chartView === "multi" ? "Switch to Single Stock View" : "Switch to Multi-Stock View"}
                </button>
                <Index data={indicesData}/>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Stock List */}
                    <div className="col-span-1">
                        <StockList onSelect={handleStockSelect} />
                    </div>
                    {/* Chart */}
                    <div className="col-span-2">
                        {chartView === "multi" || !selectedStock ? (
                            <StockMultiLineChart stocks={stocks} />
                        ) : (
                            <StockChart stockName={selectedStock} data={mockChartData} />
                        )}
                    </div>
                </div>
        </main>
        {/* Modal for Login */}
        <Modal
          // @ts-ignore
          open={showModal}
          onClose={() => setShowModal(false)}
          aria-labelledby="login-modal-title"
          aria-describedby="login-modal-description"
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg">
            <h2 id="login-modal-title" className="text-lg font-bold">
              Session Expired
            </h2>
            <p id="login-modal-description" className="mt-2">
              Please log in to continue.
            </p>
            <button
              onClick={handleLoginRedirect}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Go to Login
            </button>
          </div>
        </Modal>
        </div>
    );
};

export default Home;
