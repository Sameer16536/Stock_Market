import { useEffect, useState } from "react";
import WebSocketService from "./WebSocketService";
import { emitter } from "../hooks/PubSub";

export interface AggregatedData {
  gainers: any[];
  losers: any[];
  indices: any[];
  weekData: any[];
}

export const useWebSocket = (channel: string): AggregatedData => {
  const [data, setData] = useState<AggregatedData>({
    gainers: [],
    losers: [],
    indices: [],
    weekData: [],
  });

  useEffect(() => {
    if (!WebSocketService.isConnected(channel)) {
      WebSocketService.connect(channel);
    }

    const handleMessage = (message: any) => {
      try {
        // Ensure the message has the expected structure
        if (message.type === "existing" && message.data) {
          setData(message.data);
        } else {
          console.warn("Unexpected WebSocket message format:", message);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    emitter.on(`${channel}-message`, handleMessage);

    return () => {
      WebSocketService.disconnect(channel);
      emitter.off(`${channel}-message`, handleMessage);
    };
  }, [channel]);

  return data;
};
