import WebSocket from "ws";
import Redis from "ioredis";

const redisClient = new Redis(); // For normal commands
const redisSubscriber = new Redis(); // For Pub/Sub
const subscribers = new Set<WebSocket>(); // Track connected clients

// WebSocket server that uses the same HTTP server
export const createWebSocketServer = (httpServer: any) => {
  const wss = new WebSocket.Server({ server: httpServer });

  // Aggregated stock data
  let aggregatedData: any = {
    gainers: [],
    losers: [],
    indices: [],
    weekData: [],
  };

  wss.on("connection", async (ws) => {
    console.warn("Client connected");
    subscribers.add(ws);
    try {
      const existingData = {
        gainers: JSON.parse((await redisClient.get("nse:gainers")) || "[]"),
        losers: JSON.parse((await redisClient.get("nse:losers")) || "[]"),
        indices: JSON.parse((await redisClient.get("nse:indices")) || "[]"),
        weekData: JSON.parse((await redisClient.get("nse:week52")) || "[]"),
      };

      ws.send(JSON.stringify({ type: "existing", data: existingData }));
    } catch (error) {
      console.error("❌ Error fetching existing data:", error);
    }

    ws.on("close", () => {
      console.error("Client disconnected");
      subscribers.delete(ws);
    });
  });

  // ✅ Use a separate Redis instance for subscribing
  redisSubscriber.subscribe("nse:stock-updates", (err, count) => {
    if (err) {
      console.error("❌ Error subscribing to Redis channel:", err);
      return;
    }
  });

  // Listen for new stock updates from Redis
  redisSubscriber.on("message", (channel, message) => {
    if (channel === "nse:stock-updates") {

      try {
        const update = JSON.parse(message);

        // Update aggregated data based on the Redis key
        if (update.key === "nse:indices" && Array.isArray(update.value)) {
          aggregatedData.indices = update.value;
        } else if (update.key === "nse:gainers" && Array.isArray(update.value)) {
          aggregatedData.gainers = update.value;
        } else if (update.key === "nse:losers" && Array.isArray(update.value)) {
          aggregatedData.losers = update.value;
        } else if (update.key === "nse:week52" && Array.isArray(update.value)) {
          aggregatedData.weekData = update.value;
        }

        // Send updated stock data to **all** connected clients
        const consolidatedData = {
          gainers: aggregatedData.gainers,
          losers: aggregatedData.losers,
          indices: aggregatedData.indices,
          weekData: aggregatedData.weekData,
        };

        subscribers.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "update", data: consolidatedData }));
          }
        });

      } catch (error) {
        console.error("❌ Error processing Redis message:", error);
      }
    }
  });

};
