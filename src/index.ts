import Telegraf from 'telegraf';
import {dialogStateStorage} from "./storages/DialogStateStorage";
import {DialogState} from "./models/DialogState";
import {dutyScheduleDraftStorage} from "./storages/DutyScheduleDraftStorage";
import {Interval, intervalOptions} from "./models/Interval";
import {DutySchedule} from "./models/DutySchedule";
import {dutyScheduleStorage} from "./storages/DutyScheduleStorage";

const PORT = Number(process.env.PORT) ?? 3000;

const BOT_URL = process.env.BOT_URL ?? '';
const BOT_TOKEN = process.env.BOT_TOKEN ?? '';

const bot = new Telegraf(BOT_TOKEN);

bot.command('newschedule', async ctx => {
    const {chat} = ctx;
    if (!chat) return;

    await dialogStateStorage.set(chat.id, DialogState.Members)
    return ctx.reply('Input a list of your team members (each name should be on a new line):')
});

bot.hears(/^[^\/].*/, async ctx => {
    const {chat} = ctx;
    if (!chat) return;

    const dialogState = await dialogStateStorage.get(chat.id)
    const draft = await dutyScheduleDraftStorage.get(chat.id)

    switch (dialogState) {
        case DialogState.Members: {
            const members = (ctx.message?.text ?? '')
                .split('\n')
                .map(member => member.trim())
                .filter(Boolean);

            if (members.length < 0) {
                return ctx.reply('You have input an empty list of team members. Try again, please.')
            }

            await dutyScheduleDraftStorage.set(chat.id, {
                ...draft,
                members
            })
            await dialogStateStorage.set(chat.id, DialogState.Interval)

            return ctx.reply('Input an interval for duty schedule notifications:', {
                reply_markup: {
                    inline_keyboard: [intervalOptions]
                }
            })
        }
        case DialogState.Time: {
            const [hours, minutes] = (ctx.message?.text ?? '')
                .split(':')
                .map(Number)
                .filter(Number.isFinite)
                .filter(Number.isInteger);

            if (!hours || hours < 0 || hours > 23) {
                return ctx.reply('You have input hours in a wrong format. Try again, please.')
            }

            if (!minutes || minutes < 0 || minutes > 59) {
                return ctx.reply('You have input minutes in a wrong format. Try again, please.')
            }

            await dutyScheduleDraftStorage.set(chat.id, {
                ...draft,
                time: {
                    hours,
                    minutes,
                }
            })
            await dialogStateStorage.set(chat.id, DialogState.TeamSize)

            return ctx.reply('How many people should be on duty at a time:')
        }
        case DialogState.TeamSize: {
            const teamSize = Number(ctx.message?.text ?? '')

            if (!Number.isFinite(teamSize) || !Number.isFinite(teamSize)) {
                return ctx.reply('The team size should be an integer. Try again, please.')
            }

            const {members, interval, time} = draft;

            if (!members || !interval || !time) {
                await dutyScheduleDraftStorage.delete(chat.id);
                await dialogStateStorage.set(chat.id, DialogState.Members);

                return ctx.reply('Something went wrong, when you tried to describe a new duty schedule. Try starting over.\n'
                    + 'Input a list of your team members (each name should be on a new line)')
            }

            await dutyScheduleDraftStorage.delete(chat.id);
            await dialogStateStorage.delete(chat.id);

            const dutySchedule: DutySchedule = {
                members,
                interval,
                time,
                teamSize,
                pointer: 0,
            }

            await dutyScheduleStorage.set(chat.id, dutySchedule);

            return ctx.reply(JSON.stringify(dutySchedule, null, 2))
        }
    }
})

bot.action(Object.values(Interval), async ctx => {
    const {chat} = ctx;
    if (!chat) return;

    const dialogState = await dialogStateStorage.get(chat.id);
    const draft = await dutyScheduleDraftStorage.get(chat.id);

    if (dialogState === DialogState.Interval) {
        const interval = (ctx.callbackQuery?.data ?? '') as Interval

        await dutyScheduleDraftStorage.set(chat.id, {
            ...draft,
            interval,
        })
        await dialogStateStorage.set(chat.id, DialogState.Time)

        return ctx.reply('Input times of day when the duty schedule notification should be sent (in 24:00 format):')
    }
})

bot.command('currentschedule', async ctx => {
    const {chat} = ctx;
    if (!chat) return;

    const dutySchedule = await dutyScheduleStorage.get(chat.id);

    if (!dutySchedule) {
        return ctx.reply('There is no duty schedule yet. Send /newschedule to create a new duty schedule.')
    }

    return ctx.reply(JSON.stringify(dutySchedule, null, 2))
});

bot.command('deleteschedule', async ctx => {
    const {chat} = ctx;
    if (!chat) return;

    await dutyScheduleStorage.delete(chat.id);

    return ctx.reply('The current duty schedule has been removed. Send /newschedule to create a new duty schedule.')
});

bot.command('help', ctx => {
    return ctx.reply('This bot will help you to create a duty schedule. Send /newschedule to create a new duty schedule.');
});

bot.telegram.setWebhook(`${BOT_URL}/bot`)
    .then(() => {
        bot.startWebhook('/bot', null, PORT);
        return bot.launch();
    })
    .then(() => {
        console.log('Duty Schedule Bot is started!');
    });