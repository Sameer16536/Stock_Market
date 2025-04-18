import { useEffect, useState } from "react";

import { Modal } from "@mui/material";
import {  useNavigate } from "react-router-dom";
import NavBar from "../component/Navbar";
import Index from "../component/Index";
import StockTable from "../component/StockTable";
import Week52Data from "../component/Week52Data";
import { useWebSocket } from "../websocket/useWebSocket";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store"; 

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
  label: string;
  count: number;
};


const Home = () => {
  const { gainers, losers, indices, weekData } = useWebSocket();
  console.log(gainers);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(false);
  const [showModal, setShowModal] = useState<boolean | null>(false);
  const [stockGainers, setStockGainers] = useState<Gainer[]>([]);
  const [stocklosers, setStockLosers] = useState<Loser[]>([]);
  const [stockindices, setStockIndices] = useState<Index[]>([]);
  const [stockweekData, setStockWeekData] = useState<WeekData[]>([]);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    }
  }, [user]);

  useEffect(() => {
    // setStockGainers(gainers);
    setStockLosers(losers);
    setStockIndices(indices);
    setStockWeekData(weekData);
  }, [losers, indices, weekData]);

  useEffect(() => {
    if (gainers && Array.isArray(gainers.value)) {
      console.log("Gainers Data:", gainers.value);
      setStockGainers(gainers.value);
    } else {
      setStockGainers([]);
    }
  }, [gainers]);
  
  useEffect(() => {
    if (losers && Array.isArray(losers.value)) {
      console.log("Losers Data:", losers.value);
      setStockLosers(losers.value);
    } else {
      setStockLosers([]);
    }
  }, [losers]);
  
  useEffect(() => {
    if (indices && Array.isArray(indices.value)) {
      console.log("Indices Data:", indices.value);
      setStockIndices(indices.value);
    } else {
      setStockIndices([]);
    }
  }, [indices]);
  

  useEffect(() => {
    if (weekData) {
      console.log("week Data:", weekData); // Debug to confirm structure
      setStockWeekData(weekData.value || []); // Ensure we pass the array only
    }
  }, [weekData]);

  useEffect(() => {
    if (!isLoggedIn) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 5 * 60000); // 300,000 ms = 5 minutes

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
        
        <Index data={stockindices} />
        <Week52Data weekData={stockweekData} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        </div>

        <StockTable gainersData={stockGainers} losersData={stocklosers} />
      </main>
      {/* Modal for Login */}
      <Modal
      //@ts-expect-error "Modal" is not a valid prop
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
      </Modal>-107.05 (-0.46%)


    </div>
  );
};

export default Home;
