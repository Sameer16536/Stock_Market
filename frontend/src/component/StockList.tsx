import React from "react";

const stocks = [
    { "name": "Reliance Industries Ltd", "symbol": "RELIANCE", "price": 1244.1, "change": "+10.0%" },
    { "name": "Tata Steel Ltd", "symbol": "TATASTEEL", "price": 122.94, "change": "+2.5%" },
    { "name": "Infosys Ltd", "symbol": "INFY", "price": 1968.85, "change": "+0.5%" },
    { "name": "Hindustan Unilever Ltd", "symbol": "HINDUNILVR", "price": 2465.0, "change": "+1.2%" },
    { "name": "State Bank of India", "symbol": "SBIN", "price": 732.95, "change": "+0.8%" }
]


interface StockListProps {
    onSelect: (stockName: string) => void;
}

const StockList: React.FC<StockListProps> = ({ onSelect }) => {
    return (
        <div className="p-4">
            <table className="w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Symbol</th>
                        <th className="border p-2">Price</th>
                        <th className="border p-2">% Change</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map((stock, idx) => (
                        <tr
                            key={idx}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => onSelect(stock.name)}
                        >
                            <td className="border p-2">{stock.name}</td>
                            <td className="border p-2">{stock.symbol}</td>
                            <td className="border p-2">{stock.price}</td>
                            <td className={`border p-2 ${stock.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
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
