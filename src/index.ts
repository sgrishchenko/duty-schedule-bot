import Telegraf from 'telegraf';
import {DialogStateContext} from "./types";
import {Interval} from "./models/Interval";
import {helpMiddleware} from "./middlewares/helpMiddleware";
import {newScheduleMiddleware} from "./middlewares/newScheduleMiddleware";
import {currentScheduleMiddleware} from "./middlewares/currentScheduleMiddleware";
import {deleteScheduleMiddleware} from "./middlewares/deleteScheduleMiddleware";
import {dialogStateMiddleware} from "./middlewares/dialogStateMiddleware";
import {dialogStateIntervalMiddleware} from "./middlewares/dialogStateIntervalMiddleware";
import {dialogStateMembersMiddleware} from "./middlewares/dialogStateMembersMiddleware";
import {dialogStateTimeMiddleware} from "./middlewares/dialogStateTimeMiddleware";
import {dialogStateTeamSizeMiddleware} from "./middlewares/dialogStateTeamSizeMiddleware";
import {schedulerService} from "./services/SchedulerService";

const PORT = Number(process.env.PORT) ?? 3000;

const BOT_URL = process.env.BOT_URL ?? '';
const BOT_TOKEN = process.env.BOT_TOKEN ?? '';

export const bot = new Telegraf<DialogStateContext>(BOT_TOKEN);

bot.start(helpMiddleware);
bot.help(helpMiddleware);

bot.command('newschedule', newScheduleMiddleware);

bot.command('currentschedule', currentScheduleMiddleware);

bot.command('deleteschedule', deleteScheduleMiddleware);

bot.on(
    'message',
    dialogStateMiddleware,
    dialogStateMembersMiddleware,
    dialogStateTimeMiddleware,
    dialogStateTeamSizeMiddleware,
)

bot.action(
    Object.values(Interval),
    dialogStateMiddleware,
    dialogStateIntervalMiddleware,
)

bot.telegram.setWebhook(`${BOT_URL}/bot`)
    .then(() => {
        bot.startWebhook('/bot', null, PORT);
        return bot.launch();
    })
    .then(() => {
        console.log('Duty Schedule Bot is started!');
    });

schedulerService
    .init((chatId, text) => {
        bot.telegram.sendMessage(chatId, text).catch(error => {
            console.log(error)
        });
    })
    .catch(error => {
        console.log(error)
    })