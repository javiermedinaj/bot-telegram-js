import TelegramBot from "node-telegram-bot-api";
import jumboScraper from "./scrapers/jumbo-scraper.js";
import carrefourScraper from "./scrapers/carrefour-scraper.js";
import farmacityScraper from "./scrapers/farmacity-scraper.js";
import farmaonlineScraper from "./scrapers/farmaonline-scraper.js";
import finanzasargyScraper from "./scrapers/finanzy-scraper.js";

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
    /farmacity - Busca productos baratos en Farmacity.
    /farmaonline - Busca productos baratos en Farmaonline.

    Otros comandos
    /dolar - Dice el valor del dólar en el momento.
    
    Por ejemplo:
    /jumbo yerba
    /carrefour azucar
    /farmacity suplementos
    /farmaonline serum
    `;
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

  bot.onText(/\/farmaonline (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const productName = match[1];

    try {
      const products = await farmaonlineScraper(productName);
      let message = `Estos son los 10 productos más baratos y mas vendidos que encontré para '${productName}' en FarmaOnline:\n`;

      for (let i = 0; i < Math.min(10, products.length); i++) {
        const item = products[i];
        message += `Marca: ${item.brand}\nNombre: ${item.name}\nPrecio: ${item.price}\nEnlace: ${item.link}\n\n`;
      }

      bot.sendMessage(chatId, message);
    } catch (error) {
      console.error("Error occurred while scraping FarmaOnline:", error);
      bot.sendMessage(chatId, `Lo siento, ocurrió un error al obtener los productos de FarmaOnline para '${productName}'.`);
    }
  });

  bot.onText(/\/dolar/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const exchangeRates = await finanzasargyScraper();
      const now = new Date();
      const options = { hour: "2-digit", minute: "2-digit" };
      let message = `Estos son los valores del dolar las ${now.toLocaleTimeString([], options)}\n\n`;

      for (const rate of exchangeRates) {
        message += `Nombre: ${rate.name}\nVenta: ${rate.salePrice}\nCompra: ${rate.purchasePrice}\n\n`;
      }

      bot.sendMessage(chatId, message);
    } catch (error) {
      console.error("Error occurred while fetching exchange rates:", error);
      bot.sendMessage(chatId, "Lo siento, ocurrió un error al obtener los valores del dolar.");
    }
  });
  
  bot.onText(/\/commands/, (msg) => {
    const chatId = msg.chat.id;
    const message = "Puedes usar los siguientes comandos:\n\n/jumbo - Buscar productos baratos en Jumbo.\n/carrefour - Buscar productos baratos en Carrefour.\n/farmacity - Buscar productos baratos en Farmacity.\n/farmaonline - Buscar productos baratos en Farmaonline.\n/dolar - Consultar valores del dolar.";
    
    // Personalizar la apariencia del teclado de opciones
    const options = {
      reply_markup: {
        keyboard: [["/jumbo", "/carrefour"], ["/farmacity", "/farmaonline"], ["/dolar"]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    };

    bot.sendMessage(chatId, message, options);
  });

  bot.onText(/\//, (msg) => {
    const chatId = msg.chat.id;

    // Personalizar la apariencia del teclado de opciones
    const options = {
      reply_markup: {
        keyboard: [["/jumbo", "/carrefour"], ["/farmacity", "/farmaonline"], ["/dolar"]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    };

    bot.sendMessage(chatId, "Estos son los comandos disponibles:", options);
  });

  bot.on("polling_error", (error) => {
    console.log(error);
  });
}

export { startTelegramBot };
