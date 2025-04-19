//here we will get the data from the redis cache , extract the symbol 

import { getStockDataFromRedis } from "./redis.service";
import { scrapeStockHistory } from "./stock.service";



// Function to extract symbols from structured data
const extractSymbols = (data: { [key: string]: any[] }): string[] => {
    // Flatten all arrays and extract symbols
    const symbols = Object.values(data)
      .flat()
      .map((item) => item.symbol);
  
    // Ensure symbols are unique
    return Array.from(new Set(symbols));
  };

export  const processRedisData = async () => {
    const keys = ["nse:gainers", "nse:losers"]; 
    const structuredData = await getStockDataFromRedis(keys);
    const symbols = extractSymbols(structuredData);

    for (const symbol of symbols) {
      try {
        await scrapeStockHistory(symbol);
      } catch (error) {
        console.error(`Error scraping history for ${symbol}:`, error);
      }
    }
  };