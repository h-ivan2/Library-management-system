const cron = require('node-cron');
const { checkOverdueBooks } = require('../utils/emailService');

// Run every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log('Checking for overdue books...');
  await checkOverdueBooks();
});

console.log('Overdue book checker scheduled');