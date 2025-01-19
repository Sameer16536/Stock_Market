import WebSocket from 'ws';
import Redis from 'ioredis';

const redis = new Redis();

// WebSocket server that uses the same HTTP server
export const createWebSocketServer = (httpServer: any) => {
  const wss = new WebSocket.Server({ server: httpServer });

  wss.on('connection', async (ws) => {
    console.log('Client connected');

    // Fetch existing stock data from Redis
    try {
      const existingData = await redis.get('nse:stock-updates'); // Get the existing stock data
      if (existingData) {
        console.log('Sending existing stock data to client:', existingData);
        ws.send(`Existing stock data: ${existingData}`);
      } else {
        console.log('No existing stock data found in Redis.');
      }
    } catch (error) {
      console.error('Error fetching data from Redis:', error);
    }

    // Subscribe to the Redis Pub/Sub channel for future updates
    redis.subscribe('nse:stock-updates', (err, count) => {
      if (err) {
        console.error('Error subscribing to Redis channel:', err);
        return;
      }
      console.log(`Subscribed to ${count} channel(s).`);
    });

    // Handle incoming messages from Redis
    redis.on('message', (channel, message) => {
      if (channel === 'nse:stock-updates') {
        console.log(`Received update from Redis: ${message}`);
        ws.send(`Stock data updated: ${message}`);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  console.log('WebSocket server is using the same HTTP server');
};
