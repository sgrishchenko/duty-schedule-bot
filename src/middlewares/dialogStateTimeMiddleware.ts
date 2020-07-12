import {Middleware} from "telegraf";
import {DialogStateContext} from "../types";
import {DialogState} from "../models/DialogState";
import {dutyScheduleDraftStorage} from "../storages/DutyScheduleDraftStorage";
import {dialogStateStorage} from "../storages/DialogStateStorage";

export const dialogStateTimeMiddleware: Middleware<DialogStateContext> = async (ctx, next) => {
    if (ctx.dialogState !== DialogState.Time) {
        return next()
    }

    const draft = await dutyScheduleDraftStorage.get(ctx.chat.id)

    const [hours, minutes] = (ctx.message?.text ?? '')
        .split(':')
        .map(Number);

    if (!Number.isInteger(hours) || hours < 0 || hours > 23) {
        return ctx.reply('You have input hours in a wrong format. Try again, please.')
    }

    if (!Number.isInteger(minutes) || minutes < 0 || minutes > 59) {
        return ctx.reply('You have input minutes in a wrong format. Try again, please.')
    }

    await dutyScheduleDraftStorage.set(ctx.chat.id, {
        ...draft,
        time: {
            hours,
            minutes,
        }
    })
    await dialogStateStorage.set(ctx.chat.id, DialogState.TeamSize)

    return ctx.reply('How many people should be on duty at a time:')
}