import {Middleware} from "telegraf";
import {TelegrafContext} from "telegraf/typings/context";
import {DialogStateContext} from "../types";
import {dialogStateStorage} from "../storages/DialogStateStorage";

export const dialogStateMiddleware: Middleware<TelegrafContext> = async (ctx, next) => {
    const {chat} = ctx;
    if (!chat) return;

    (ctx as DialogStateContext).dialogState = await dialogStateStorage.get(chat.id)

    await next();
}
