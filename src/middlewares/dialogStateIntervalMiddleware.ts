import {Middleware} from "telegraf";
import {DialogStateContext} from "../types";
import {DialogState} from "../models/DialogState";
import {Interval} from "../models/Interval";
import {dutyScheduleDraftStorage} from "../storages/DutyScheduleDraftStorage";
import {dialogStateStorage} from "../storages/DialogStateStorage";

export const dialogStateIntervalMiddleware: Middleware<DialogStateContext> = async (ctx, next) => {
    if (ctx.dialogState !== DialogState.Interval) {
        return next()
    }

    const draft = await dutyScheduleDraftStorage.get(ctx.chat.id)

    const interval = (ctx.callbackQuery?.data ?? '') as Interval

    await dutyScheduleDraftStorage.set(ctx.chat.id, {
        ...draft,
        interval,
    })
    await dialogStateStorage.set(ctx.chat.id, DialogState.Time)

    return ctx.reply(
        'Input times of day when ' +
        'the duty schedule notification should be sent (in 24:00 format):'
    )
}