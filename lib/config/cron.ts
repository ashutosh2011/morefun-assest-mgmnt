export const CRON_CONFIG = {
  // Run at 00:01 AM on March 31st
  ANNUAL_DEPRECIATION: '1 0 31 3 *',
  
  // Secret key for verifying cron requests
  SECRET: process.env.CRON_SECRET || 'your-default-secret'
}; 