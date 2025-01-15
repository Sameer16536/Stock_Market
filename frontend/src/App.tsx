import React, { useState } from "react";
import StockList from "./component/StockList"
import StockChart from "./component/StockChart";

const mockChartData = [
  { time: "09:00 AM", price: 300.5 },
  { time: "10:00 AM", price: 127.0 },
  { time: "11:00 AM", price: 700.5 },
  { time: "12:00 PM", price: 1000.0 },
  { time: "01:00 PM", price: 124.5 },
  { time: "03:00 PM", price: 125.0 },
  { time: "04:00 PM", price: 125.0 },

];

const Home = () => {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 text-center font-bold text-xl">
        Real-Time Stock Tracker
      </header>
      <main className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stock List */}
          <div className="col-span-1">
            <StockList onSelect={(stockName) => setSelectedStock(stockName)} />
          </div>
          {/* Chart */}
          <div className="col-span-2">
            {selectedStock ? (
              <StockChart stockName={selectedStock} data={mockChartData} />
            ) : (
              <div className="text-gray-500">Select a stock to view the chart.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
