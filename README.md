# Nerkkis (node-verkkis) Bot

Bot for polling rarely available products (eg. Playstation 5) from Verkkokauppa.com and adding them to shopping cart. Can also be used for high traffic offers, like Black Friday deals. Successful runs are notified via Telegram (optional).

## Usage

### Configuration

Configuration is given as environment variables.

| Variable key             | Required | Description                                                                                                               |
| ------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| VK_EMAIL                 | X        | Verkkokauppa.com username (your email)                                                                                    |
| VK_PASSWORD              | X        | Verkkokauppa.com password                                                                                                 |
| VK_PRODUCT_URL           | X        | Product URL of the wanted product (eg. https://www.verkkokauppa.com/fi/product/602044/Sony-PlayStation-5-PS5-pelikonsoli) |
| PRODUCT_NAME             |          | Optional human readable product name, only used for Telegram messages                                                     |
| POLLING_INTERVAL_SECONDS |          | Polling interval for retries, defaults to 15 minutes. Set to shorter value for high traffic deals.                        |
| EXIT_ON_SUCCESS          |          | Exit when product successfully added to cart? Defaults to true.                                                           |
| TELEGRAM_TOKEN           |          | Telegram Bot token (see instructions below)                                                                               |
| TELEGRAM_CHAT_ID         |          | Telegram chat ID (see instructions below)                                                                                 |

### NPM

You should have [nvm](https://github.com/nvm-sh/nvm) installed.

1. Clone the repository
2. Run `nvm use` to select correct Node version.
3. Run `npm install`.
4. Start the app with config as environment variables

```bash
TELEGRAM_TOKEN=ABCD_NOT_THE_REAL_TOKEN TELEGRAM_CHAT_ID=1234567890 VK_EMAIL=username@example.org VK_PASSWORD=super-long-password POLLING_INTERVAL_SECONDS=15 EXIT_ON_SUCCESS=false VK_PRODUCT_URL=https://www.verkkokauppa.com/fi/product/602044/Sony-PlayStation-5-PS5-pelikonsoli PRODUCT_NAME=Playstation npm run start
```

### Docker

The app can also be ran with Docker, to simplify the setup.

1. Clone the repository
2. Build docker image `docker build -t nerkkis .`
3. Run in container

```bash
docker run -it --init -e TELEGRAM_TOKEN=ABCD_NOT_THE_REAL_TOKEN -e TELEGRAM_CHAT_ID=1234567890 -e VK_EMAIL=username@example.org -e VK_PASSWORD=super-long-password -e POLLING_INTERVAL_SECONDS=15 -e EXIT_ON_SUCCESS=false -e VK_PRODUCT_URL=https://www.verkkokauppa.com/fi/product/602044/Sony-PlayStation-5-PS5-pelikonsoli -e PRODUCT_NAME=Playstation nerkkis
```

### Telegram Bot

To receive notifications of successful runs, you need to create a Telegram bot.

Create the bot by talking to [@BotFather](https://t.me/BotFather) in Telegram. Take note of the given token, its passed as `TELEGRAM_TOKEN` environment variable.

Find your user/chat ID by talking to [@JsonDumpBot](https://t.me/JsonDumpBot) in Telegram. Write a message to the bot and it will reply with JSON. Your chat ID is under `message -> from -> id`. This will be passed as `TELEGRAM_CHAT_ID` environment variable.
