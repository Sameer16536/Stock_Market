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
    const currentTime = Date.now(); // Get the current timestamp in milliseconds
    const dateObject = new Date(currentTime);
    const hours = String(dateObject.getHours()).padStart(2, "0");
    const minutes = String(dateObject.getMinutes()).padStart(2, "0");
    const seconds = String(dateObject.getSeconds()).padStart(2, "0");

    const handleMessage = (message: any) => {
      if (message.type === "existing" && message.data) {
        setData(message.data);
        console.log(
          "Received Existing data from useWebsocket at:",
          `${hours}:${minutes}:${seconds}`
        );
        console.log("✅ Received existing data from WebSocket:", message.data);
      } else if (message.type === "update" && message.data) {
        setData(message.data);
        console.log(
          "Received Updated data from useWebsocket at:",
          `${hours}:${minutes}:${seconds}`
        );
        console.log("📈 Received updated data from WebSocket:", message.data);
      } else {
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
