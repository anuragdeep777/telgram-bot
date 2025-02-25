const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');
const fs = require('fs');

const token = '7427344544:AAEvwrF4_i1CmKI2nRANnRAoBJeld0MkM9A';
const bot = new TelegramBot(token, { polling: true });
const app = express();

const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Telegram News Bot is running!'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const users = {}; // User usage tracking

// Function to fetch top news from News API
async function getTopNews() {
    try {
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=in&apiKey=7fde200620b74ecb82dfa34a9f5a6d83`);
        const articles = response.data.articles.slice(0, 5);
        return articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            image: article.urlToImage
        }));
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}

// Command: Start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Welcome! Type /news to get top 5 live news headlines with images.");
});

// Command: News
bot.onText(/\/news/, async (msg) => {
    const chatId = msg.chat.id;
    
    // Check user usage
    if (!users[chatId]) users[chatId] = 0;
    if (users[chatId] >= 5) {
        bot.sendMessage(chatId, "⚠️ You have used your 5 free requests. Please pay ₹50 to continue.\n\nUPI ID: 8873132662@ybl\n\nAfter payment, contact @yourusername for activation.");
        return;
    }

    // Fetch and send news
    const news = await getTopNews();
    if (news.length === 0) {
        bot.sendMessage(chatId, "Sorry, couldn't fetch news. Try again later.");
        return;
    }

    for (const article of news) {
        const message = `📰 *${article.title}*\n\n${article.description}\n[Read More](${article.url})`;
        await bot.sendPhoto(chatId, article.image, { caption: message, parse_mode: "Markdown" });
    }

    users[chatId] += 1;
});

// Admin Command to Reset User Count (After Payment)
bot.onText(/\/reset (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const targetId = match[1];
    
    if (chatId == "YOUR_ADMIN_CHAT_ID") {
        users[targetId] = 0;
        bot.sendMessage(targetId, "✅ Your access has been reset. You can now use /news again.");
        bot.sendMessage(chatId, `✅ User ${targetId} has been reset.`);
    } else {
        bot.sendMessage(chatId, "❌ You are not authorized to use this command.");
    }
});