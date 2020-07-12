import {Middleware} from "telegraf";
import {DialogStateContext} from "../types";
import {DialogState} from "../models/DialogState";
import {DutySchedule} from "../models/DutySchedule";
import {dutyScheduleDraftStorage} from "../storages/DutyScheduleDraftStorage";
import {dialogStateStorage} from "../storages/DialogStateStorage";
import {dutyScheduleStorage} from "../storages/DutyScheduleStorage";

export const dialogStateTeamSizeMiddleware: Middleware<DialogStateContext> = async (ctx, next) => {
    if (ctx.dialogState !== DialogState.TeamSize) {
        return next()
    }

    const draft = await dutyScheduleDraftStorage.get(ctx.chat.id)

    const teamSize = Number(ctx.message?.text ?? '')

    if (!Number.isInteger(teamSize)) {
        return ctx.reply('The team size should be an integer. Try again, please.')
    }

    const {members, interval, time} = draft;

    if (!members || !interval || !time) {
        await dutyScheduleDraftStorage.delete(ctx.chat.id);
        await dialogStateStorage.set(ctx.chat.id, DialogState.Members);

        return ctx.reply(
            'Something went wrong, when you tried to describe a new duty schedule. Try starting over.\n' +
            'Input a list of your team members (each name should be on a new line):'
        )
    }

    await dutyScheduleDraftStorage.delete(ctx.chat.id);
    await dialogStateStorage.delete(ctx.chat.id);

    const dutySchedule: DutySchedule = {
        members,
        interval,
        time,
        teamSize,
        pointer: 0,
    }

    await dutyScheduleStorage.set(ctx.chat.id, dutySchedule);

    return ctx.reply(JSON.stringify(dutySchedule, null, 2))
}