import React from "react";

const stocks = [
    { "name": "Reliance Industries Ltd", "symbol": "RELIANCE", "price": 1244.1, "change": "-10.0%" },
    { "name": "Tata Steel Ltd", "symbol": "TATASTEEL", "price": 122.94, "change": "+2.5%" },
    { "name": "Infosys Ltd", "symbol": "INFY", "price": 1968.85, "change": "+0.5%" },
    { "name": "Hindustan Unilever Ltd", "symbol": "HINDUNILVR", "price": 2465.0, "change": "+1.2%" },
    { "name": "State Bank of India", "symbol": "SBIN", "price": 732.95, "change": "+0.8%" },
    { "name": "Wipro Ltd", "symbol": "WIPRO", "price": 410.2, "change": "-0.3%" },
    { "name": "HDFC Bank Ltd", "symbol": "HDFCBANK", "price": 1556.3, "change": "+1.5%" },
    { "name": "Bharti Airtel Ltd", "symbol": "BHARTIARTL", "price": 829.45, "change": "+2.1%" },
    { "name": "ICICI Bank Ltd", "symbol": "ICICIBANK", "price": 950.25, "change": "-0.8%" },
    { "name": "TCS Ltd", "symbol": "TCS", "price": 3476.4, "change": "+1.0%" }
];


interface StockListProps {
    onSelect: (stockName: string) => void;
}

const StockList: React.FC<StockListProps> = ({ onSelect }) => {
    return (
        <div className="p-6 bg-gradient-to-b from-gray-100 to-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Stock Market Overview</h2>
            <table className="w-full text-sm text-left border-collapse rounded-lg overflow-hidden shadow-lg">
                <thead>
                    <tr className="bg-blue-600 text-white">
                        <th className="p-4">Name</th>
                        <th className="p-4">Symbol</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">% Change</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map((stock, idx) => (
                        <tr
                            key={idx}
                            className="bg-white even:bg-gray-50 hover:bg-blue-100 transition duration-300 cursor-pointer"
                            onClick={() => onSelect(stock.name)}
                        >
                            <td className="p-4 border-b border-gray-200 text-gray-800">{stock.name}</td>
                            <td className="p-4 border-b border-gray-200 text-gray-700">{stock.symbol}</td>
                            <td className="p-4 border-b border-gray-200 font-semibold text-gray-800">{`₹${stock.price.toFixed(2)}`}</td>
                            <td
                                className={`p-4 border-b border-gray-200 font-medium ${stock.change.startsWith("+")
                                    ? "text-green-600"
                                    : "text-red-600"
                                    }`}
                            >
                                {stock.change}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StockList;
