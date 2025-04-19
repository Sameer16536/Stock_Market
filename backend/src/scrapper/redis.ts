import Redis from "ioredis";

// Connects to Redis on default localhost:6379
const redis  = new Redis()


export async function storeInRedis(key: string, data: any):Promise<void> {
  try {
    //Serialize Json data to a string
    const scrappedData = JSON.stringify({ key, value: data });
    //Store the data in Redis
    await redis.set(key, scrappedData);
    await redis.publish('nse:stock-updates', scrappedData); // Publish the update to the Redis Pub/Sub channel
  } catch (error) {
    console.error(error);
    
  }}
    