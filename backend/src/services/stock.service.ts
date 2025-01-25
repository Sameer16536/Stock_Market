import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { chromium } from 'playwright';
import { writeJSON } from 'fs-extra';
import path from 'path';
import { storeInRedis } from '../scrapper/redis';

const OUTPUT_FILE = path.resolve(__dirname, '../stock_history_data.json');



export async function scrapeStockHistory(stockSymbol: string) {
  const browser = await chromium.launch({ headless: false }); // Set headless to true in production
  const page = await browser.newPage();

  // Block unnecessary resources to improve performance
  await page.route('**/*', (route) => {
    if (['image', 'stylesheet', 'font'].includes(route.request().resourceType())) {
      route.abort();
    } else {
      route.continue();
    }
  });

  try {
    const stockHistoryUrl = `https://www.nseindia.com/get-quotes/equity?symbol=${stockSymbol}`;
    console.log('Navigating to:', stockHistoryUrl);

    // Navigate to the URL
    await page.goto(stockHistoryUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for the stock history table to load
    await page.waitForSelector('.card .card-body .table-wrap');
    await page.waitForSelector('#orderBookTradeVol', { timeout: 5000 });

    await page.$eval('.iNavDisplay', (el) => (el.style.display = 'block'));

// Extract trade information
const tradeInfo = await page.evaluate(() => ({
    tradedVolume: (document.getElementById("orderBookTradeVol") as HTMLElement)?.innerText || 'N/A',
    tradedValue: (document.getElementById("orderBookTradeVal") as HTMLElement)?.innerText || 'N/A',
    totalMarketCap: (document.getElementById("orderBookTradeTMC") as HTMLElement)?.innerText || 'N/A',
    freeFloatMarketCap: (document.getElementById("orderBookTradeFFMC") as HTMLElement)?.innerText || 'N/A',
    impactCost: (document.getElementById("orderBookTradeIC") as HTMLElement)?.innerText || 'N/A',
    deliverablePercentage: (document.getElementById("orderBookDeliveryTradedQty") as HTMLElement)?.innerText || 'N/A',
    applicableMarginRate: (document.getElementById("orderBookAppMarRate") as HTMLElement)?.innerText || 'N/A',
    faceValue: (document.getElementById("mainFaceValue") as HTMLElement)?.innerText || 'N/A',
  }));
  
  // Extract price information
  const priceInfo = await page.evaluate(() => ({
    weekHigh: (document.getElementById("week52highVal") as HTMLElement)?.innerText || 'N/A',
    weekHighDate: (document.getElementById("week52HighDate") as HTMLElement)?.innerText || 'N/A',
    weekLow: (document.getElementById("week52lowVal") as HTMLElement)?.innerText || 'N/A',
    weekLowDate: (document.getElementById("week52LowDate") as HTMLElement)?.innerText || 'N/A',
    upperBand: (document.getElementById("upperbandVal") as HTMLElement)?.innerText || 'N/A',
    lowerBand: (document.getElementById("lowerbandVal") as HTMLElement)?.innerText || 'N/A',
    priceBand: (document.getElementById("pricebandVal") as HTMLElement)?.innerText || 'N/A',
    dailyVolatility: (document.getElementById("orderBookTradeDV") as HTMLElement)?.innerText || 'N/A',
    annualVolatility: (document.getElementById("orderBookTradeAV") as HTMLElement)?.innerText || 'N/A',
    tickSize: (document.getElementById("tickSize") as HTMLElement)?.innerText || 'N/A',
  }));
  
  // Extract securities information
  const securitiesInfo = await page.evaluate(() => {
    const tableRows = document.querySelectorAll('#securities_info_table tbody tr');
    return {
      status: (document.getElementById("Listed") as HTMLElement)?.innerText || 'N/A',
      tradingStatus: (document.getElementById("Active") as HTMLElement)?.innerText || 'N/A',
      dateOfListing: tableRows[2]?.querySelector('td.text-right')?.textContent?.trim() || 'N/A',
      adjustedPE: tableRows[3]?.querySelector('td.text-right')?.textContent?.trim() || 'N/A',
      symbolPE: tableRows[4]?.querySelector('td.text-right')?.textContent?.trim() || 'N/A',
      index: tableRows[5]?.querySelector('td.text-right')?.textContent?.trim() || 'N/A',
      basicIndustry: tableRows[6]?.querySelector('td.text-right')?.textContent?.trim() || 'N/A',
    };
  });
  

    console.log('Trade Information:', tradeInfo);
    console.log('Price Information:', priceInfo);
    console.log('Securities Information:', securitiesInfo);

    // Scrape historical stock data
    

    // Save extracted data to JSON
    await writeJSON(OUTPUT_FILE, { tradeInfo, priceInfo, securitiesInfo,});

    console.log('Data saved to:', OUTPUT_FILE);
  } catch (error) {
    console.error('Error scraping stock history:', error);
    throw new Error('Failed to scrape stock history');
  } finally {
    await browser.close();
  }
}

scrapeStockHistory('HINDUNILVR')
  .then(() => console.log('Stock history scraping completed successfully.'))
  .catch((error) => console.error('Stock history scraper encountered an error:', error));

export const saveStockHistory = async (symbol: string, historyData: any[]) => {
    try {
      const stock = await prisma.stock.findUnique({ where: { symbol } });
      if (!stock) {
        throw new Error(`Stock with symbol ${symbol} not found`);
      }
  
      for (const record of historyData) {
        await prisma.stockHistory.create({
          data: {
            stockId: stock.id,
            date: record.date,
            openPrice: record.openPrice,
            highPrice: record.highPrice,
            lowPrice: record.lowPrice,
            closePrice: record.closePrice,
            volume: record.volume,
          },
        });
      }
  
      console.log(`Stock history for ${symbol} saved successfully!`);
    } catch (error) {
      console.error('Error saving stock history:', error);
      throw new Error('Failed to save stock history');
    }
  };

