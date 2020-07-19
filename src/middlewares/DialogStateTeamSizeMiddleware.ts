import { inject, injectable } from "inversify";
import { Types } from "../types";
import { Middleware } from "./Middleware";
import { DialogStateContext } from "../contexts/DialogStateContext";
import { DialogStateStorage } from "../storages/DialogStateStorage";
import { DutyScheduleDraftStorage } from "../storages/DutyScheduleDraftStorage";
import { DutyScheduleStorage } from "../storages/DutyScheduleStorage";
import { SchedulerService } from "../services/SchedulerService";
import { DialogState } from "../models/DialogState";
import { DutySchedule } from "../models/DutySchedule";
import { DutyScheduleView } from "../views/DutyScheduleView";

@injectable()
export class DialogStateTeamSizeMiddleware extends Middleware<
  DialogStateContext
> {
  public constructor(
    @inject(Types.DialogStateStorage)
    private dialogStateStorage: DialogStateStorage,
    @inject(Types.DutyScheduleDraftStorage)
    private dutyScheduleDraftStorage: DutyScheduleDraftStorage,
    @inject(Types.DutyScheduleStorage)
    private dutyScheduleStorage: DutyScheduleStorage,

    @inject(Types.SchedulerService)
    private schedulerService: SchedulerService,
    @inject(Types.DutyScheduleView)
    private dutyScheduleView: DutyScheduleView
  ) {
    super();
  }

  public async handle(ctx: DialogStateContext, next: () => Promise<void>) {
    if (ctx.dialogState !== DialogState.TeamSize) {
      return next();
    }

    const draft = await this.dutyScheduleDraftStorage.get(ctx.chat.id);

    const teamSize = Number(ctx.message?.text ?? "");

    if (!Number.isInteger(teamSize)) {
      return ctx.reply(
        "The team size should be an integer. Please try again, or input /cancel for canceling."
      );
    }

    const { members, interval, time } = draft;

    if (!members || !interval || !time) {
      await this.dutyScheduleDraftStorage.delete(ctx.chat.id);
      await this.dialogStateStorage.set(ctx.chat.id, DialogState.Members);

      return ctx.reply(
        "Something went wrong, when you tried to describe a new duty schedule. Try starting over.\n" +
          "Input a list of your team members (each name should be on a new line):",
        {
          reply_markup: {
            force_reply: true,
          },
        }
      );
    }

    await this.dutyScheduleDraftStorage.delete(ctx.chat.id);
    await this.dialogStateStorage.delete(ctx.chat.id);

    const dutySchedule: DutySchedule = {
      members,
      interval,
      time,
      teamSize,
      pointer: -1, // this is initial state before the first duty
    };

    await this.dutyScheduleStorage.set(ctx.chat.id, dutySchedule);
    this.schedulerService.updateScheduler(ctx.chat.id, dutySchedule);

    return ctx.replyWithMarkdown(this.dutyScheduleView.render(dutySchedule));
  }
}
