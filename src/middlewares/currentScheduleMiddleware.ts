import {Middleware} from "telegraf";
import {TelegrafContext} from "telegraf/typings/context";
import {dutyScheduleStorage} from "../storages/DutyScheduleStorage";

export const currentScheduleMiddleware: Middleware<TelegrafContext> = async ctx => {
    const {chat} = ctx;
    if (!chat) return;

    const dutySchedule = await dutyScheduleStorage.get(chat.id);

    if (!dutySchedule) {
        return ctx.reply(
            'There is no duty schedule yet. ' +
            'Send /newschedule to create a new duty schedule.'
        )
    }

    return ctx.reply(JSON.stringify(dutySchedule, null, 2))
}
