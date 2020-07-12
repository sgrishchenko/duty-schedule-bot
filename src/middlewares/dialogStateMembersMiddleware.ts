import {Middleware} from "telegraf";
import {DialogStateContext} from "../types";
import {DialogState} from "../models/DialogState";
import {intervalOptions} from "../models/Interval";
import {dutyScheduleDraftStorage} from "../storages/DutyScheduleDraftStorage";
import {dialogStateStorage} from "../storages/DialogStateStorage";

export const dialogStateMembersMiddleware: Middleware<DialogStateContext> = async (ctx, next) => {
    if (ctx.dialogState !== DialogState.Members) {
        return next()
    }

    const draft = await dutyScheduleDraftStorage.get(ctx.chat.id)

    const members = (ctx.message?.text ?? '')
        .split('\n')
        .map(member => member.trim())
        .filter(Boolean);

    if (members.length < 0) {
        return ctx.reply('You have input an empty list of team members. Try again, please.')
    }

    await dutyScheduleDraftStorage.set(ctx.chat.id, {
        ...draft,
        members
    })
    await dialogStateStorage.set(ctx.chat.id, DialogState.Interval)

    return ctx.reply('Input an interval for duty schedule notifications:', {
        reply_markup: {
            inline_keyboard: [intervalOptions]
        }
    })
}