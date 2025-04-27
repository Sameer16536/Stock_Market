
import app from './app';
import { configDotenv } from 'dotenv';
import { createWebSocketServer } from './webSocket';
import { getStockDataFromRedis } from './services/redis.service';
import { scrapeStockHistory,saveStockData,saveStockHistory } from './services/stock.service';
configDotenv();
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

createWebSocketServer(server);
