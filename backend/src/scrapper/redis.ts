import Redis from "ioredis";

// Connects to Redis on default localhost:6379
const redis  = new Redis()


export async function storeInRedis(key: string, data: any):Promise<void> {
  try {
    //Serialize Json data to a string
    const scrappedData = JSON.stringify(data);
    //Store the data in Redis
    await redis.set(key, scrappedData);
    console.log(`Data stored in Redis with key: ${key}`);
  } catch (error) {
    console.error(error);
    
  }}
    