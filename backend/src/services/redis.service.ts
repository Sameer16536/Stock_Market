import Redis from "ioredis";

const redis  = new Redis()
// Function to get stock data from Redis for multiple keys
export const getStockDataFromRedis = async (keys: string[]): Promise<{ [key: string]: any[] }> => {
    try {
        // Fetch all keys concurrently
        const data = await Promise.all(keys.map((key) => redis.get(key)));

        // Log raw Redis data for debugging
        console.log("Raw Redis Data:", data);

        // Parse and extract 'value' field
        return keys.reduce((acc, key, index) => {
            try {
                const parsedData = JSON.parse(data[index] || "{}");

                if (Array.isArray(parsedData.value)) {
                    acc[key] = parsedData.value; // Assign the value field if it's valid
                } else {
                    console.warn(`Invalid or missing 'value' field for key "${key}":`, parsedData);
                    acc[key] = []; // Default to empty array
                }
            } catch (error) {
                console.error(`Error parsing Redis data for key "${key}":`, error);
                acc[key] = []; // Default to empty array on failure
            }
            return acc;
        }, {} as { [key: string]: any[] });
    } catch (error) {
        console.error("Error fetching data from Redis:", error);
        return {};
    }
};
