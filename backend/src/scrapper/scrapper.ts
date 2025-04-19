import { chromium } from 'playwright';
import { writeJSON } from 'fs-extra';
import path from 'path';
import { storeInRedis } from './redis';

const OUTPUT_FILE = path.resolve(__dirname, '../nse_stock_data.json');

interface StockData {
  symbol: string;
  ltp: number; // Last Traded Price
  percentageChange: number; // % change
  volume: number; // Volume traded
  timestamp: string;
}



interface IndexData {
  symbol: string; // Index name
  ltp: number; // Last Traded Price
  percentageChange: string; // % change (raw text including both value and %)
  timestamp: string; // Timestamp of the scrape
}

interface WeekData {
  label: string;
  count: number;
}

export async function scrapeNSEIndia() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.route('**/*', (route) => {
    if (['image', 'stylesheet', 'font'].includes(route.request().resourceType())) {
      route.abort();
    } else {
      route.continue();
    }
  });
  try {
    // Navigate to the NSE India homepage
    await page.goto('https://www.nseindia.com', { timeout: 30000 });

    await Promise.all([
      page.waitForSelector('.gainers tbody tr'),
      page.waitForSelector('.loosers tbody tr'),
      page.waitForSelector('.nav.nav-tabs'),
      page.waitForSelector('.week52_white_bg'),

    ]);

    // Scrape stock data from the Gainers table
    const gainers: StockData[] = await page.$$eval('.gainers tbody tr', (rows) =>
      rows.map((row) => {
        const cells = row.querySelectorAll('td');
        const symbol = cells[0]?.textContent?.trim() || 'N/A';
        const ltp = parseFloat(cells[1]?.textContent?.replace(',', '') || '0'); // Last Traded Price
        const percentageChange = parseFloat(cells[2]?.textContent?.replace('%', '').trim() || '0');
        const volume = parseInt(cells[3]?.textContent?.replace(/,/g, '') || '0', 10); // Volume traded
        const timestamp = new Date().toISOString();
       
        if (symbol === 'N/A' || isNaN(ltp)) {
          return null; // Invalid data, return null
        }
    
        return { symbol, ltp, percentageChange, volume, timestamp };
      }).filter((stock) => stock !== null) // Filter out null values
    ) as StockData[]; 
    

    // Scrape stock data from the Losers table
    const losers: StockData[] = await page.$$eval('.loosers tbody tr', (rows) =>
      rows.map((row) => {
        const cells = row.querySelectorAll('td');
        const symbol = cells[0]?.textContent?.trim() || 'N/A';
        const ltp = parseFloat(cells[1]?.textContent?.replace(',', '') || '0'); // Last Traded Price
        const percentageChange = parseFloat(cells[2]?.textContent?.replace('%', '').trim() || '0');
        const volume = parseInt(cells[3]?.textContent?.replace(/,/g, '') || '0', 10); // Volume traded
        const timestamp = new Date().toISOString();
        
        if (symbol === 'N/A' || isNaN(ltp)) {
          return null; // Invalid data, return null
        }
    
        return { symbol, ltp, percentageChange, volume, timestamp };
      }).filter((stock) => stock !== null) // Filter out null values
    ) as StockData[]; 

   // Scrape index data from the `.nav-tabs` container
   const indicesData: IndexData[] = await page.$$eval('.nav.nav-tabs .nav-item', (tabs) =>
    tabs.map((tab) => {
      const symbol =
        tab.querySelector('.tb_name')?.textContent?.trim() || 'N/A'; // Index name
      const ltpText =
        tab.querySelector('.tb_val')?.textContent?.replace(',', '').trim() ||
        '0'; // Last Traded Price
      const percentageChange =
        tab.querySelector('.tb_per')?.textContent?.trim() || 'N/A'; // % Change
      const ltp = parseFloat(ltpText.split(' ')[0]); // Extract numerical value of LTP
      const timestamp = new Date().toISOString(); // Timestamp
      
   
      if (symbol === 'N/A' || isNaN(ltp)) {
        return null; // Invalid data, return null
      }
  
      return { symbol, ltp, percentageChange, timestamp };
    }).filter((stock) => stock !== null) // Filter out null values
  ) as IndexData[]; 

    // Scrape 52-week high and low data
    const week52Data: WeekData[] = await page.$$eval('.week52_white_bg .item', (items) => {
      const data: { label: string; count: number }[] = items.map((item) => {
        const label = item.querySelector('p span.font-bold')?.textContent?.trim() || 'N/A';
        const count = parseInt(item.querySelector('a')?.textContent?.trim() || '0', 10);
        return { label, count };
      });
    
      // Remove duplicates using a Map
      const uniqueData = Array.from(
        new Map(data.map((item) => [`${item.label}-${item.count}`, item])).values()
      );
    
      return uniqueData;
    });
    

    const stocks = { gainers, losers, indicesData, week52Data };

    // Save scraped data to a JSON file
    await writeJSON(OUTPUT_FILE, stocks, { spaces: 2 });
    //Store the data in Redis
    await storeInRedis('nse:gainers', gainers);
    await storeInRedis('nse:losers', losers);
    await storeInRedis('nse:indices', indicesData);
    await storeInRedis('nse:week52', week52Data);
  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    await browser.close();
  }
}