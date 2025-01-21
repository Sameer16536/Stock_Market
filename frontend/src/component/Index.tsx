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
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
            {data.map((index) => {
                // Extract the sign from percentageChange to determine color
                const isPositive = !index.percentageChange.includes("-");
                return (
                    <div
                        key={index.symbol}
                        className={`p-4 border rounded shadow-md ${isPositive ? "border-green-500" : "border-red-500"
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
