import axios from 'axios';
import * as TelegramBot from 'node-telegram-bot-api';
import { URL } from 'url';
import { Config, getConfig, log, sleepSeconds } from './utils';

const BASE_URL = 'https://api.verkkokauppa.com/api/v2/';
const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64; rv:99.0) Gecko/20100101 Firefox/99.0';

const login = async (email: string, password: string): Promise<string> => {
  const resp = await axios({
    baseURL: BASE_URL,
    url: '/login',
    headers: {
      'User-Agent': USER_AGENT,
    },
    data: {
      email,
      password,
    },
    method: 'POST',
  });
  return resp.data.track;
};

const getCart = async (token: string): Promise<string> => {
  const resp = await axios({
    baseURL: BASE_URL,
    url: '/mycart',
    headers: {
      'User-Agent': USER_AGENT,
      'Authorization': `Bearer ${token}`,
    },
    method: 'GET',
  });
  log(`Found cart with id ${resp.data.cartUuid}`);
  return resp.data.cartUuid;
};

const addToCart = async (token: string, cartId: string, config: Config): Promise<any> => {
  const sku = new URL(config.verkkokauppaCom.productUrl).pathname.split('/')[3];

  while (true) {
    log(`Trying to add ${config.productName} to cart...`);
    try {
      const resp = await axios({
        baseURL: BASE_URL,
        url: `/cart/${cartId}?pid=${sku}&quantity=1`,
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:99.0) Gecko/20100101 Firefox/99.0',
          'Authorization': `Bearer ${token}`,
          'Referer': config.verkkokauppaCom.productUrl,
        },
        method: 'PUT',
      });
      if (resp.data.errors.length === 0) {
        log(`Succesfully added ${config.productName} (SKU ${sku}) to cart!`);
        return;
      } else {
        log(
          `Unable to add ${config.productName} to cart (${resp.data.errors}), retrying in ${config.pollingIntervalInSeconds} seconds`
        );
      }
    } catch (e) {
      // Ignore errors, just retry
      log(
        `Error adding to cart, product might not be available. Retrying in ${config.pollingIntervalInSeconds} seconds.`
      );
    }
    await sleepSeconds(config.pollingIntervalInSeconds);
  }
};

const sendToTelegram = async (config: Config, message: string): Promise<any> => {
  const bot = new TelegramBot(config.telegram.token);
  return bot.sendMessage(config.telegram.chatId, message);
};

const runNerkkis = async () => {
  const config = getConfig();

  const token = await login(config.verkkokauppaCom.email, config.verkkokauppaCom.password);
  const cartId = await getCart(token);
  await addToCart(token, cartId, config);

  if (config.telegram.token && config.telegram.chatId) {
    await sendToTelegram(config, `${config.productName} added to shopping cart, it will be reserved for 20 minutes!`);
  }
};

runNerkkis();
