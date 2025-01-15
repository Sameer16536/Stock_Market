import { useEffect, useState } from 'react';
import WebSocketService from './WebSocketService'
import { useSub, usePub } from '../hooks/PubSub';

export interface StockData {
    symbol: string;
    ltp: number;
    change: number;
    percentageChange: number;
    timestamp: string;
}


export const useWebSocket = (url: string): StockData[] => {
    const publish = usePub()
    const [data, setData] = useState<StockData[]>([])
    const wsUrl = url
    useEffect(() => {
        if (!WebSocketService.isConnected('stockData')) {
            WebSocketService.connect('stockData')
        }
        return () => {
            WebSocketService.disconnect('stockData')
        }
    }, [])

    return (
        <div>{data}</div>
    )
}

