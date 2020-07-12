import {Middleware} from "telegraf";
import {TelegrafContext} from "telegraf/typings/context";
import {DialogState} from "../models/DialogState";
import {dialogStateStorage} from "../storages/DialogStateStorage";

export const newScheduleMiddleware: Middleware<TelegrafContext> = async ctx => {
    const {chat} = ctx;
    if (!chat) return;

    await dialogStateStorage.set(chat.id, DialogState.Members)
    return ctx.reply('Input a list of your team members (each name should be on a new line):')
}
