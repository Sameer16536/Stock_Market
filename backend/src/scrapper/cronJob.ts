import cron from 'node-cron';
import { scrapeNSEIndia } from './scrapper';
import { processRedisData } from '../services/postgres.service';

cron.schedule('*/1 * * * *', async () => {
    console.log('Running scrapper every 5 minutes');
    try{
        await scrapeNSEIndia()
        console.log('Scrapper ran successfully');
    }
    catch(err){
        console.log('Error in running scrapper', err);
    }
});

// Run the scraper immediately
(async () => {
    try {
      console.log("Running scraper on server start...");
      await processRedisData();
      console.log("Initial scraper run completed successfully");
    } catch (err) {
      console.error("Error during initial scraper run:",  err);
    }
  })();
  
  // Schedule the cron job
  cron.schedule('0 0 * * 1', async () => {
    console.log('Running scraper based on the schedule (Monday at midnight)');
    try {
      await processRedisData();
      console.log('Scheduled scraper run completed successfully');
    } catch (err) {
      console.error('Error in running scheduled scraper:', err);
    }
  });