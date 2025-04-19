import cron from 'node-cron';
import { scrapeNSEIndia } from './scrapper';
import { processRedisData } from '../services/postgres.service';
import { cleanExpiredTokens } from '../controllers/user.controller';

cron.schedule('*/1 * * * *', async () => {
    try{
        await scrapeNSEIndia()
    }
    catch(err){
        console.error('Error in running scrapper', err);
    }
});

// Run the scraper immediately
(async () => {
    try {
      await processRedisData();
    } catch (err) {
      console.error("Error during initial scraper run:",  err);
    }
  })();
  
  // Schedule the cron job
  cron.schedule('0 0 * * 1', async () => {
    try {
      await processRedisData();
      await cleanExpiredTokens()
    } catch (err) {
      console.error('Error in running scheduled scraper:', err);
    }
  });