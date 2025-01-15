import React, { useEffect, useState } from "react";
import axios from "axios";

interface StockData {
    symbol: string;
    ltp: number; // Last Traded Price
    percentageChange: number; // % change
    volume: number; // Volume traded
    timestamp: string;
}


const StockTable: React.FC = () => {
    const [stockData, setStockData] = useState<StockData[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)


    useEffect()=> {
    //Do something
}
return (
    <>Stock Table</>
)
}