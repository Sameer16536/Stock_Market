import React, { useEffect, useState } from "react";
import StockList from "../component/StockList"
import StockChart from "../component/StockChart";
import StockMultiLineChart from "../component/StockMultiLineChart";
import { Modal } from "@mui/material";
import {Link, useNavigate} from 'react-router-dom'
import NavBar from "../component/Navbar";
import Index from "../component/Index";
import StockTable from "../component/StockTable";
import Week52Data from "../component/Week52Data";


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


type Gainer = {
    symbol: string;
    ltp: number;
    percentageChange: number;
    volume: number;
    timestamp: string;
};

type Loser = Gainer; // Same structure as Gainer

type Index = {
    symbol: string;
    ltp: number;
    percentageChange: string;
    timestamp: string;
};

type WeekData = {
    label: string,
    count:number
}


const Home = () => {


    const sampleData = [{
        "type": "existing",
        "data": {
            "gainers": {
                "key": "nse:gainers",
                "value": [
                    {
                        "symbol": "APOLLOHOSP",
                        "ltp": 6925,
                        "percentageChange": 2.13,
                        "volume": 799900,
                        "timestamp": "2025-01-21T15:46:04.590Z"
                    },
                    {
                        "symbol": "TATACONSUM",
                        "ltp": 972,
                        "percentageChange": 1.22,
                        "volume": 2281022,
                        "timestamp": "2025-01-21T15:46:04.590Z"
                    },
                    {
                        "symbol": "BPCL",
                        "ltp": 280.35,
                        "percentageChange": 1.1,
                        "volume": 15304149,
                        "timestamp": "2025-01-21T15:46:04.590Z"
                    },
                    {
                        "symbol": "SHRIRAMFIN",
                        "ltp": 520.05,
                        "percentageChange": 0.65,
                        "volume": 7753705,
                        "timestamp": "2025-01-21T15:46:04.590Z"
                    },
                    {
                        "symbol": "JSWSTEEL",
                        "ltp": 924.1,
                        "percentageChange": 0.53,
                        "volume": 1474919,
                        "timestamp": "2025-01-21T15:46:04.590Z"
                    },
                    {
                        "symbol": "IOC",
                        "ltp": 131.16,
                        "percentageChange": 0.51,
                        "volume": 20272605,
                        "timestamp": "2025-01-21T15:46:04.590Z"
                    },
                    {
                        "symbol": "HINDPETRO",
                        "ltp": 370.2,
                        "percentageChange": 2.73,
                        "volume": 12344913,
                        "timestamp": "2025-01-21T15:46:04.590Z"
                    },
                    {
                        "symbol": "COLPAL",
                        "ltp": 2740,
                        "percentageChange": 1.16,
                        "volume": 385694,
                        "timestamp": "2025-01-21T15:46:04.590Z"
                    },
                    {
                        "symbol": "AUBANK",
                        "ltp": 606.4,
                        "percentageChange": 0.07,
                        "volume": 1339636,
                        "timestamp": "2025-01-21T15:46:04.591Z"
                    },
                    {
                        "symbol": "AUBANK",
                        "ltp": 606.4,
                        "percentageChange": 0.07,
                        "volume": 1339636,
                        "timestamp": "2025-01-21T15:46:04.591Z"
                    },
                    {
                        "symbol": "MUTHOOTFIN",
                        "ltp": 2168.95,
                        "percentageChange": 1.25,
                        "volume": 212025,
                        "timestamp": "2025-01-21T15:46:04.591Z"
                    },
                    {
                        "symbol": "SHRIRAMFIN",
                        "ltp": 520.05,
                        "percentageChange": 0.65,
                        "volume": 7753705,
                        "timestamp": "2025-01-21T15:46:04.591Z"
                    },
                    {
                        "symbol": "SBICARD",
                        "ltp": 763.4,
                        "percentageChange": 0.25,
                        "volume": 2834308,
                        "timestamp": "2025-01-21T15:46:04.591Z"
                    }
                ]
            },
            "losers": {
                "key": "nse:losers",
                "value": [
                    {
                        "symbol": "TRENT",
                        "ltp": 5724.75,
                        "percentageChange": -6,
                        "volume": 1553225,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "NTPC",
                        "ltp": 324.5,
                        "percentageChange": -3.44,
                        "volume": 12774630,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "ADANIPORTS",
                        "ltp": 1110.9,
                        "percentageChange": -3.29,
                        "volume": 3134022,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "ICICIBANK",
                        "ltp": 1197.95,
                        "percentageChange": -2.84,
                        "volume": 20520898,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "ADANIENT",
                        "ltp": 2375,
                        "percentageChange": -2.78,
                        "volume": 1206512,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "ZOMATO",
                        "ltp": 215.4,
                        "percentageChange": -10.16,
                        "volume": 308217731,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "JIOFIN",
                        "ltp": 259.95,
                        "percentageChange": -5.71,
                        "volume": 25289898,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "LODHA",
                        "ltp": 1146,
                        "percentageChange": -5.19,
                        "volume": 1534096,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "NAUKRI",
                        "ltp": 7455,
                        "percentageChange": -4.06,
                        "volume": 404299,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "BHEL",
                        "ltp": 209.2,
                        "percentageChange": -3.56,
                        "volume": 8267629,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "DIXON",
                        "ltp": 15118,
                        "percentageChange": -13.9,
                        "volume": 2171945,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "IDEA",
                        "ltp": 9.36,
                        "percentageChange": -5.84,
                        "volume": 561246192,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "COFORGE",
                        "ltp": 8279,
                        "percentageChange": -4.42,
                        "volume": 476851,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "INDHOTEL",
                        "ltp": 760.5,
                        "percentageChange": -4.1,
                        "volume": 3343822,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "POLYCAB",
                        "ltp": 6552,
                        "percentageChange": -3.75,
                        "volume": 380639,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "ICICIBANK",
                        "ltp": 1197.95,
                        "percentageChange": -2.84,
                        "volume": 20520898,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "SBIN",
                        "ltp": 759.8,
                        "percentageChange": -2.5,
                        "volume": 13751780,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "AXISBANK",
                        "ltp": 971.85,
                        "percentageChange": -1.64,
                        "volume": 11894500,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "CANBK",
                        "ltp": 99.5,
                        "percentageChange": -1.52,
                        "volume": 12354313,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "KOTAKBANK",
                        "ltp": 1893.6,
                        "percentageChange": -1.4,
                        "volume": 4415663,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "MCX",
                        "ltp": 5500.25,
                        "percentageChange": -8.74,
                        "volume": 2045958,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "RECLTD",
                        "ltp": 476.3,
                        "percentageChange": -2.94,
                        "volume": 5395660,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "ICICIBANK",
                        "ltp": 1197.95,
                        "percentageChange": -2.84,
                        "volume": 20520898,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "SBIN",
                        "ltp": 759.8,
                        "percentageChange": -2.5,
                        "volume": 13751780,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    },
                    {
                        "symbol": "SBILIFE",
                        "ltp": 1467,
                        "percentageChange": -2.18,
                        "volume": 877160,
                        "timestamp": "2025-01-21T15:46:04.598Z"
                    }
                ]
            },
            "indices": {
                "key": "nse:indices",
                "value": [
                    {
                        "symbol": "NIFTY 50",
                        "ltp": 23024.65,
                        "percentageChange": "-320.10 (-1.37%)",
                        "timestamp": "2025-01-21T15:46:04.607Z"
                    },
                    {
                        "symbol": "NIFTY NEXT 50",
                        "ltp": 63406.15,
                        "percentageChange": "-1,700.00 (-2.61%)",
                        "timestamp": "2025-01-21T15:46:04.607Z"
                    },
                    {
                        "symbol": "NIFTY MIDCAP SELECT",
                        "ltp": 12013.35,
                        "percentageChange": "-343.15 (-2.78%)",
                        "timestamp": "2025-01-21T15:46:04.607Z"
                    },
                    {
                        "symbol": "NIFTY BANK",
                        "ltp": 48570.9,
                        "percentageChange": "-779.90 (-1.58%)",
                        "timestamp": "2025-01-21T15:46:04.607Z"
                    },
                    {
                        "symbol": "NIFTY FINANCIAL SERVICES",
                        "ltp": 22548.9,
                        "percentageChange": "-377.80 (-1.65%)",
                        "timestamp": "2025-01-21T15:46:04.607Z"
                    }
                ]
            },
            "weekData": {
                "key": "nse:week52",
                "value": [
                    {
                        "label": "52 Week High",
                        "count": 142
                    },
                    {

                        "label": "52 Week low",
                        "count": -73
                    }
                ]
            }
        }
    }]
    const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [chartView, setChartView] = useState<"single" | "multi">("multi")
  const [isLoggedIn,setIsLoggedIn] = useState<boolean | null>(false)
    const [showModal, setShowModal] = useState<boolean | null>(false)
    const [gainers,setGainers]= useState<Gainer[]>([])
    const[losers,setLosers] = useState<Loser[]>([])
    const [indices, setIndices] = useState<Index[]>([])
    const [weekData,setWeekData] = useState<WeekData[]>([])
  const navigate = useNavigate()

    const handleSwitch = () => {
        setChartView((prevView) => (prevView === "multi" ? "single" : "multi"));
    };
    const handleStockSelect = (stockName: string) => {
        setSelectedStock(stockName);
        setChartView("single");
    };
    const { data } = sampleData[0];
    useEffect(() => {
        const { gainers, losers, indices,weekData } = sampleData[0].data;
        setGainers(gainers.value);
        setLosers(losers.value);
        setIndices(indices.value);
        setWeekData(weekData.value)
    },[])



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
        <div className="min-h-screen bg-slate-800">
      <NavBar />
            <main className="p-4">
                <button
                    onClick={handleSwitch}
                    className="mb-4 px-4 py-2 bg-yellow-500 text-white rounded"
                >
                    {chartView === "multi" ? "Switch to Single Stock View" : "Switch to Multi-Stock View"}
                </button>
                <Index data={indices} />
                <Week52Data weekData={weekData}/>
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
       
                <StockTable gainersData={gainers} losersData={ losers} />
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
              className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded"
            >
              Go to Login
            </button>
          </div>
        </Modal>
        </div>
    );
};

export default Home;
