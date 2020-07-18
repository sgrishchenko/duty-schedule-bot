import { inject, injectable } from "inversify";
import { Types } from "../types";
import { Middleware } from "./Middleware";
import { TelegrafContext } from "telegraf/typings/context";
import { DutyScheduleStorage } from "../storages/DutyScheduleStorage";
import { SchedulerService } from "../services/SchedulerService";

@injectable()
export class DeleteScheduleMiddleware extends Middleware<TelegrafContext> {
  public constructor(
    @inject(Types.DutyScheduleStorage)
    private dutyScheduleStorage: DutyScheduleStorage,

    @inject(Types.SchedulerService)
    private schedulerService: SchedulerService
  ) {
    super();
  }

  public async handle(ctx: TelegrafContext) {
    const { chat } = ctx;
    if (!chat) return;

    await this.dutyScheduleStorage.delete(chat.id);
    this.schedulerService.destroyScheduler(chat.id);

    return ctx.reply(
      "The current duty schedule has been removed. " +
        "Send /newschedule to create a new duty schedule."
    );
  }
}
