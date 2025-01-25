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
  

     // Save the scraped data to JSON file
     const fullStockData = {
      stockSymbol,
      tradeInfo,
      priceInfo,
      securitiesInfo,
    };
    await writeJSON(OUTPUT_FILE, fullStockData);
    console.log('Data saved to:', OUTPUT_FILE);

    // Save the stock info data to the database
    await saveStockData(stockSymbol, priceInfo);
    await saveStockHistory(stockSymbol,fullStockData);
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



  const saveStockData = async (stockSymbol: string, priceInfo: any) => {
    try {
      // Check if the stock already exists in the database
      let stock = await prisma.stock.findUnique({
        where: { symbol: stockSymbol },
      });
  
      // If the stock doesn't exist, create it
      if (!stock) {
        stock = await prisma.stock.create({
          data: {
            symbol: stockSymbol,  // Assuming you have a `symbol` field in your `Stock` table
            data: priceInfo,  // Save priceInfo as a JSON object in the `Stock` table
          },
        });
        console.log('Stock created:', stock);
      } else {
        console.log('Stock already exists:', stock);
      }
    } catch (error) {
      console.error('Error saving stock data:', error);
      throw new Error('Failed to save stock data.');
    }
  };
  





  
  const saveStockHistory = async (stockSymbol: string, stockData: any) => {
    try {
      // Validate input data
      if (!stockSymbol || !stockData || !stockData.priceInfo) {
        throw new Error('Invalid stock data provided.');
      }
  
      // Upsert the stock (create or update)
      const stock = await prisma.stock.upsert({
        where: { symbol: stockSymbol },
        create: {
          symbol: stockSymbol,
          data: {
            weekLow: stockData.priceInfo.weekLow || 0,
            tickSize: stockData.priceInfo.tickSize || 0,
            weekHigh: stockData.priceInfo.weekHigh || 0,
            lowerBand: stockData.priceInfo.lowerBand || 0,
            priceBand: stockData.priceInfo.priceBand || 0,
            upperBand: stockData.priceInfo.upperBand || 0,
            weekLowDate: stockData.priceInfo.weekLowDate || null,
            weekHighDate: stockData.priceInfo.weekHighDate || null,
            dailyVolatility: stockData.priceInfo.dailyVolatility || 0,
            annualVolatility: stockData.priceInfo.annualVolatility || 0,
          },
        },
        update: {
          // Update stock data if necessary
          data: {
            weekLow: stockData.priceInfo.weekLow || undefined,
            tickSize: stockData.priceInfo.tickSize || undefined,
            weekHigh: stockData.priceInfo.weekHigh || undefined,
            lowerBand: stockData.priceInfo.lowerBand || undefined,
            priceBand: stockData.priceInfo.priceBand || undefined,
            upperBand: stockData.priceInfo.upperBand || undefined,
            weekLowDate: stockData.priceInfo.weekLowDate || undefined,
            weekHighDate: stockData.priceInfo.weekHighDate || undefined,
            dailyVolatility: stockData.priceInfo.dailyVolatility || undefined,
            annualVolatility: stockData.priceInfo.annualVolatility || undefined,
          },
        },
      });
  
      // Prepare stock history data
      const stockHistoryData = {
        stockId: stock.id,
        date: stockData.date ? new Date(stockData.date) : new Date(),
        openPrice: parseFloat(stockData.priceInfo.openPrice) || 0,
        highPrice: parseFloat(stockData.priceInfo.highPrice) || 0,
        lowPrice: parseFloat(stockData.priceInfo.lowPrice) || 0,
        closePrice: parseFloat(stockData.priceInfo.closePrice) || 0,
        volume: parseInt(stockData.tradeInfo?.volume, 10) || 0,
        tradeInfo: stockData.tradeInfo || {},
        priceInfo: stockData.priceInfo || {},
        securitiesInfo: stockData.securitiesInfo || {},
      };
  
      // Upsert the stock history
      await prisma.stockHistory.upsert({
        where: {
          stockId_date: {
            stockId: stockHistoryData.stockId,
            date: stockHistoryData.date,
          },
        },
        update: {
          ...stockHistoryData, // Update all fields if the record exists
        },
        create: {
          ...stockHistoryData, // Create a new record if none exists
        },
      });
  
      console.log(`Stock history for "${stockSymbol}" saved successfully.`);
    } catch (error) {
      console.error('Error saving stock history:', error);
      throw new Error('Failed to save stock history.');
    }
  };
  