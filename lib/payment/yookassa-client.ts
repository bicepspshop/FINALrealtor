import YooKassa from 'yookassa';

// Initialize YooKassa client with shop ID and secret key
// Only initialize if we have required environment variables
let yooKassaClient: any = null;

// Safely initialize the YooKassa client
export function getYooKassaClient() {
  // Only initialize on the server side
  if (typeof window === 'undefined') {
    if (!yooKassaClient && process.env.YOOKASSA_SHOP_ID && process.env.YOOKASSA_SECRET_KEY) {
      yooKassaClient = new YooKassa({
        shopId: process.env.YOOKASSA_SHOP_ID,
        secretKey: process.env.YOOKASSA_SECRET_KEY
      });
    }
  }
  
  return yooKassaClient;
}

// Subscription plan prices
export const SUBSCRIPTION_PRICES = {
  monthly: 1, // 2000 RUB per month
  yearly: 16801  // 16800 RUB per year
}; 