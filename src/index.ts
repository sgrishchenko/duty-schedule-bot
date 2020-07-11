import Telegraf from 'telegraf';

const PORT = Number(process.env.PORT) ?? 3000;

const BOT_URL = process.env.BOT_URL ?? '';
const BOT_TOKEN = process.env.BOT_TOKEN ?? '';

const bot = new Telegraf(BOT_TOKEN);

bot.command('newschedule', (ctx) => {
    ctx.reply('Hello');
});

bot.command('help', (ctx) => {
    return ctx.reply('This bot will help you to create a duty schedule. Send /newschedule to create a new duty schedule.');
});

bot.telegram.setWebhook(`${BOT_URL}/bot`)
    .then(() => {
        bot.startWebhook('/bot', null, PORT);
        return bot.launch();
    })
    .then(() =>{
        console.log('Duty Schedule Bot is started!');
    });