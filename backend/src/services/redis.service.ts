import Redis from "ioredis";

const redis  = new Redis()
export const getStockDataFromRedis = async (key: string): Promise<any> => {
    try {
        const data = await redis.get(key);
        if(data){
        return JSON.parse(data);
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
    }