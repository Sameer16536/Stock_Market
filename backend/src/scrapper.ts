import { chromium } from 'playwright';
import { writeJSON } from 'fs-extra';
import path from 'path';

const OUTPUT_FILE = path.resolve(__dirname, 'nse_stock_data.json');

interface StockData {
  symbol: string;
  ltp: number; // Last Traded Price
  percentageChange: number; // % change
  volume: number; // Volume traded
  timestamp: string;
}

async function scrapeNSEIndia() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Navigate to the NSE India homepage
    await page.goto('https://www.nseindia.com', { timeout: 60000 });

    // Wait for the gainers and losers tables to load
    await page.waitForSelector('.gainers tbody tr', { timeout: 30000 });
    await page.waitForSelector('.loosers tbody tr', { timeout: 30000 });

    // Scrape stock data from the Gainers table
    const gainers: StockData[] = await page.$$eval('.gainers tbody tr', (rows) =>
      rows.map((row) => {
        const cells = row.querySelectorAll('td');
        const symbol = cells[0]?.textContent?.trim() || 'N/A';
        const ltp = parseFloat(cells[1]?.textContent?.replace(',', '') || '0'); // Last Traded Price
        const percentageChange = parseFloat(cells[2]?.textContent?.replace('%', '').trim() || '0');
        const volume = parseInt(cells[3]?.textContent?.replace(/,/g, '') || '0', 10); // Volume traded
        const timestamp = new Date().toISOString();
        return { symbol, ltp, percentageChange, volume, timestamp };
      })
    );

    // Scrape stock data from the Losers table
    const losers: StockData[] = await page.$$eval('.loosers tbody tr', (rows) =>
      rows.map((row) => {
        const cells = row.querySelectorAll('td');
        const symbol = cells[0]?.textContent?.trim() || 'N/A';
        const ltp = parseFloat(cells[1]?.textContent?.replace(',', '') || '0'); // Last Traded Price
        const percentageChange = parseFloat(cells[2]?.textContent?.replace('%', '').trim() || '0');
        const volume = parseInt(cells[3]?.textContent?.replace(/,/g, '') || '0', 10); // Volume traded
        const timestamp = new Date().toISOString();
        return { symbol, ltp, percentageChange, volume, timestamp };
      })
    );

    const stocks = { gainers, losers };

    console.log('Scraped data:', stocks);

    // Save scraped data to a JSON file
    await writeJSON(OUTPUT_FILE, stocks, { spaces: 2 });
    console.log(`Data saved to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    await browser.close();
  }
}

// Run the scraper
scrapeNSEIndia()
  .then(() => console.log('Scraping completed successfully.'))
  .catch((error) => console.error('Scraper encountered an error:', error));
