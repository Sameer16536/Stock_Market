import { useEffect, useState } from "react";
import WebSocketService from "./WebSocketService";
import { emitter } from "../hooks/PubSub";

export interface AggregatedData {
  gainers: any[];
  losers: any[];
  indices: any[];
  weekData: any[];
}

export const useWebSocket = (): AggregatedData => {
  const [data, setData] = useState<AggregatedData>({
    gainers: [],
    losers: [],
    indices: [],
    weekData: [],
  });

  useEffect(() => {
    if (!WebSocketService.isConnected()) {
      WebSocketService.connect();
    }

    const handleMessage = (message: any) => {
      if (message.type === "existing" && message.data) {
        setData(message.data);
        console.log("✅ Received existing data from WebSocket:", message.data);
      }else if (message.type === "update" && message.data) {
        setData(message.data);
        console.log("📈 Received updated data from WebSocket:", message.data);
      } 
      else {
        console.warn("Unexpected WebSocket message:", message);
      }
    };

    emitter.on("ws-message", handleMessage);

    return () => {
      WebSocketService.disconnect();
      emitter.off("ws-message", handleMessage);
    };
  }, []);

  return data;
};
