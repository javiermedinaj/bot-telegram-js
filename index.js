import dotenv from 'dotenv'; 
import fs from 'fs';
import TelegramBot from "node-telegram-bot-api";

dotenv.config();
const bot = new TelegramBot( process.env.BOT_TOKEN, { polling: true });

// Leer el archivo JSON con los datos del web scraping
fs.readFile('farma.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo:', err);
        return;
    }

    const scrapedData = JSON.parse(data);

    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        const username = msg.from.username;

        // Ordenar los datos por precio de menor a mayor
        const sortedData = scrapedData.sort((a, b) => parseFloat(a.price.replace(/[^\d.]/g, '')) - parseFloat(b.price.replace(/[^\d.]/g, '')));

        let message = `Hola ${username}! Soy tu bot de Telegram. Aquí tienes los 10 productos más baratos:\n`;

        // Tomar solo los 10 primeros elementos del arreglo ordenado
        const top10Products = sortedData.slice(0, 10);

        top10Products.forEach(item => {
            message += `Nombre: ${item.name}\nPrecio: ${item.price}\nEnlace: ${item.link}\n\n`;
        });

        bot.sendMessage(chatId, message);
    });

    bot.on('polling_error', (error) => {
        console.log(error);
    });
});
