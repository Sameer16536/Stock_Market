import WebSocket from "ws";
import Redis from "ioredis";

const redis = new Redis();

// WebSocket server that uses the same HTTP server
export const createWebSocketServer = (httpServer: any) => {
  const wss = new WebSocket.Server({ server: httpServer });

  // Aggregated data object
  let aggregatedData: any = {
    gainers: [],
    losers: [],
    indices: [],
  };

  wss.on("connection", async (ws) => {
    console.log("Client connected");

    // Send existing data to the client on connection
    try {
      const existingData = {
        gainers: JSON.parse((await redis.get("nse:gainers")) || "[]"),
        losers: JSON.parse((await redis.get("nse:losers")) || "[]"),
        indices: JSON.parse((await redis.get("nse:indices")) || "[]"),
      };

      ws.send(JSON.stringify({ type: "existing", data: existingData }));
      console.log("Sent existing data to client:", existingData);
    } catch (error) {
      console.error("Error fetching existing data:", error);
    }

    // Subscribe to Redis Pub/Sub channel
    redis.subscribe("nse:stock-updates", (err, count) => {
      if (err) {
        console.error("Error subscribing to Redis channel:", err);
        return;
      }
      console.log(`Subscribed to ${count} channel(s).`);
    });

    // Handle Pub/Sub messages
    redis.on("message", (channel, message) => {
      if (channel === "nse:stock-updates") {
        console.log("Received message from Redis Pub/Sub:", message);
    
        try {
          const update = JSON.parse(message);
          console.log("Parsed update object:", update);
    
          // Use the key to update the corresponding part of aggregatedData
          if (update.key === "nse:indices" && Array.isArray(update.value)) {
            aggregatedData.indices = update.value;
          } else if (update.key === "nse:gainers" && Array.isArray(update.value)) {
            aggregatedData.gainers = update.value;
          } else if (update.key === "nse:losers" && Array.isArray(update.value)) {
            aggregatedData.losers = update.value;
          }
    
          console.log("Updated aggregated data:", aggregatedData);
    
          // Send consolidated data to all connected clients
          const consolidatedData = {
            gainers: aggregatedData.gainers,
            losers: aggregatedData.losers,
            indices: aggregatedData.indices,
          };
    
          ws.send(JSON.stringify({ type: "update", data: consolidatedData }));
          console.log("Sent consolidated data to client:", consolidatedData);
        } catch (error) {
          console.error("Error processing Redis message:", error);
        }
      }
    });
    
    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  console.log("WebSocket server is using the same HTTP server");
};
