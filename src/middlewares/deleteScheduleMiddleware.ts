import {Middleware} from "telegraf";
import {TelegrafContext} from "telegraf/typings/context";
import {dutyScheduleStorage} from "../storages/DutyScheduleStorage";

export const deleteScheduleMiddleware: Middleware<TelegrafContext> = async ctx => {
    const {chat} = ctx;
    if (!chat) return;

    await dutyScheduleStorage.delete(chat.id);

    return ctx.reply(
        'The current duty schedule has been removed. ' +
        'Send /newschedule to create a new duty schedule.'
    )
}
