import React from "react";

interface StockData {
    symbol: string;
    ltp: number;
    percentageChange: number;
    volume: number;
    timestamp: string;
}

interface StockTableProps {
    gainersData: StockData[];
    losersData: StockData[]
}

const StockTable: React.FC<StockTableProps> = ({ gainersData,losersData }) => {
    const gainers = gainersData
    const losers = losersData
    const currentTime = Date.now(); // Get the current timestamp in milliseconds
    const dateObject = new Date(currentTime);
    const hours = String(dateObject.getHours()).padStart(2, '0');
    const minutes = String(dateObject.getMinutes()).padStart(2, '0');
    const seconds = String(dateObject.getSeconds()).padStart(2, '0');
    console.log("Data received in stock table at:", `${hours}:${minutes}:${seconds}`);
    console.log("Gainers:", gainers);
    console.log("Losers:", losers);
    
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6">Gainers & Losers</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gainers Table */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <h2 className="text-xl font-bold bg-green-100 text-green-700 py-3 px-4">
                        Gainers
                    </h2>
                    <table className="w-full text-left">
                        <thead className="bg-gray-200 text-gray-600">
                            <tr>
                                <th className="px-4 py-2">Symbol</th>
                                <th className="px-4 py-2">LTP</th>
                                <th className="px-4 py-2">% Change</th>
                                <th className="px-4 py-2">Volume</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gainers.length > 0 ? (
                                gainers.map((stock) => (
                                    <tr
                                    key={`${stock.symbol}-${stock.timestamp}`}
                                        className="hover:bg-gray-100 border-b last:border-none"
                                    >
                                        <td className="px-4 py-2">{stock.symbol}</td>
                                        <td className="px-4 py-2">{stock.ltp}</td>
                                        <td className="px-4 py-2 text-green-500 font-semibold">
                                            +{stock.percentageChange}%
                                        </td>
                                        <td className="px-4 py-2">{stock.volume}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="text-center py-4 text-gray-500 italic"
                                    >
                                        No gainers found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Losers Table */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <h2 className="text-xl font-bold bg-red-100 text-red-700 py-3 px-4">
                        Losers
                    </h2>
                    <table className="w-full text-left">
                        <thead className="bg-gray-200 text-gray-600">
                            <tr>
                                <th className="px-4 py-2">Symbol</th>
                                <th className="px-4 py-2">LTP</th>
                                <th className="px-4 py-2">% Change</th>
                                <th className="px-4 py-2">Volume</th>
                            </tr>
                        </thead>
                        <tbody>
                            {losers.length > 0 ? (
                                losers.map((stock) => (
                                    <tr
                                    key={`${stock.symbol}-${stock.timestamp}`}
                                        className="hover:bg-gray-100 border-b last:border-none"
                                    >
                                        <td className="px-4 py-2">{stock.symbol}</td>
                                        <td className="px-4 py-2">{stock.ltp}</td>
                                        <td className="px-4 py-2 text-red-500 font-semibold">
                                            {stock.percentageChange}%
                                        </td>
                                        <td className="px-4 py-2">{stock.volume}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="text-center py-4 text-gray-500 italic"
                                    >
                                        No losers found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StockTable;
