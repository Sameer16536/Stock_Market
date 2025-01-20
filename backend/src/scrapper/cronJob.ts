import cron from 'node-cron';
import { scrapeNSEIndia } from './scrapper';

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