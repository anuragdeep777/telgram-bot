const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// Replace with your own token
const token = '7427344544:AAEvwrF4_i1CmKI2nRANnRAoBJeld0MkM9A';
const bot = new TelegramBot(token, { polling: true });

// Create an Express app
const app = express();

// Define a simple route
app.get('/', (req, res) => {
    res.send('Telegram Bot is running!');
});

// Start the Express server
const PORT = process.env.PORT || 3000; // Use the PORT environment variable or default to 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Emojis array
const emojis = ['😀', '😂', '😍', '😎', '🤔', '😢', '😡', '🥳', '😱', '🤖'];

// Telegram bot commands
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome! I will send you random emojis. Type /emoji to get one.');
});

bot.onText(/\/emoji/, (msg) => {
    const chatId = msg.chat.id;
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    bot.sendMessage(chatId, randomEmoji);
});