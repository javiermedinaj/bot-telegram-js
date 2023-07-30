import TelegramBot from "node-telegram-bot-api";
import jumboScraper from "./jumbo-scrapper.js";
import carrefourScraper from "./carrefour-scrapper.js";
import farmacityScraper from "./farmacity-scrapper.js";

import dotenv from 'dotenv'; 

dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

function startTelegramBot() {
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username;

    const message = `Hola ${username}! Soy tu bot de Telegram. Puedes usar los siguientes comandos para ver los productos más baratos:

    /jumbo  - Busca productos baratos en Jumbo.
    /carrefour - Busca productos baratos en Carrefour.

    Por ejemplo:
    /jumbo yerba
    /carrefour azucar`;
    bot.sendMessage(chatId, message);
  });

  bot.onText(/\/jumbo (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const productName = match[1];

    try {
      const products = await jumboScraper(productName);
      let message = `Estos son los 10 productos más baratos que encontré para '${productName}' en Jumbo:\n`;

      for (let i = 0; i < Math.min(10, products.length); i++) {
        const item = products[i];
        message += `Nombre: ${item.name}\nPrecio: ${item.price}\nEnlace: ${item.link}\n\n`;
      }

      bot.sendMessage(chatId, message);
    } catch (error) {
      console.error("Error occurred while scraping Jumbo:", error);
      bot.sendMessage(chatId, `Lo siento, ocurrió un error al obtener los productos de Jumbo para '${productName}'.`);
    }
  });

  bot.onText(/\/carrefour (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const productName = match[1];
  
    try {
      const products = await carrefourScraper(productName);
      let message = `Estos son los 10 productos más baratos que encontré para '${productName}' en Carrefour:\n`;
  
      for (let i = 0; i < Math.min(10, products.length); i++) {
        const item = products[i];
        message += `Nombre: ${item.name}\nPrecio: ${item.price}\nEnlace: ${item.link}\n\n`;
      }
  
      bot.sendMessage(chatId, message);
    } catch (error) {
      console.error("Error occurred while scraping Carrefour:", error);
      bot.sendMessage(chatId, `Lo siento, ocurrió un error al obtener los productos de Carrefour para '${productName}'.`);
    }
  });

  bot.onText(/\/farmacity (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const productName = match[1];

    try {
      const products = await farmacityScraper(productName);
      let message = `Estos son los 10 productos más baratos y mas vendidos que encontré para '${productName}' en Farmacity:\n`;

      for (let i = 0; i < Math.min(10, products.length); i++) {
        const item = products[i];
        message += `Nombre: ${item.name}\nPrecio: ${item.price}\nEnlace: ${item.link}\n\n`;
      }

      bot.sendMessage(chatId, message);
    } catch (error) {
      console.error("Error occurred while scraping Farmacity:", error);
      bot.sendMessage(chatId, `Lo siento, ocurrió un error al obtener los productos de Farmacity para '${productName}'.`);
    }
  });

  bot.on("polling_error", (error) => {
    console.log(error);
  });
}

export { startTelegramBot };
