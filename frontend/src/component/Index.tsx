import React from "react";

interface IndexData {
    symbol: string;
    ltp: number;
    percentageChange: string;
    timestamp: string;
}

interface IndicesProps {
    data: IndexData[];
}

const Index: React.FC<IndicesProps> = ({ data }) => {
    const columns = Math.min(5, data.length); // Limit columns to 5 max for better layout

    return (
        <div
            className="grid gap-4 p-4"
            style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, // Create dynamic columns
            }}
        >
            {data.map((index) => {
                // Extract the sign from percentageChange to determine color
                const isPositive = !index.percentageChange.includes("-");
                return (
                    <div
                        key={index.symbol}
                        className={`p-4 border rounded shadow-md text-white ${isPositive ? "border-green-500" : "border-red-500"
                            }`}
                    >
                        <h2 className="text-lg font-semibold">{index.symbol}</h2>
                        <p className="text-2xl font-bold">{index.ltp}</p>
                        <p
                            className={`text-sm ${isPositive ? "text-green-500" : "text-red-500"
                                }`}
                        >
                            {index.percentageChange}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default Index;
