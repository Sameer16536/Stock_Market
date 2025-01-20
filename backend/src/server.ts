import { dot } from 'node:test/reporters';
import app from './app';
import { configDotenv } from 'dotenv';
import { createWebSocketServer } from './webSocket';
import { getStockDataFromRedis } from './services/redis.service';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Fetch data from Redis and log it
const fetchData = async () => {
  try {
    const data = await getStockDataFromRedis('nse:indices');
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

fetchData()
  .then(redisData => {
    // console.log(redisData); // This will log the data once the promise resolves
  })
  .catch(error => {
    console.error(error); // Handle errors if any
  });

createWebSocketServer(server);
