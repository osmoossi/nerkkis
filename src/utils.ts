export const sleepSeconds = (seconds: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });

export interface Config {
  telegram: {
    token: string;
    chatId: string;
  };
  verkkokauppaCom: {
    email: string;
    password: string;
    productUrl: string;
  };
  productName: string;
  pollingIntervalInSeconds: number;
  exitOnSuccess: boolean;
}
export const getConfig = (): Config => ({
  telegram: {
    token: process.env.TELEGRAM_TOKEN || '',
    chatId: process.env.TELEGRAM_CHAT_ID || '',
  },
  verkkokauppaCom: {
    email: process.env.VK_EMAIL || '',
    password: process.env.VK_PASSWORD || '',
    productUrl: process.env.VK_PRODUCT_URL || '',
  },
  productName: process.env.PRODUCT_NAME || 'product',
  pollingIntervalInSeconds: process.env.POLLING_INTERVAL_SECONDS
    ? parseInt(process.env.POLLING_INTERVAL_SECONDS)
    : 15 * 60, // Defaults to 15 minutes
  exitOnSuccess: process.env.EXIT_ON_SUCCESS === 'false' ? false : true,
});
