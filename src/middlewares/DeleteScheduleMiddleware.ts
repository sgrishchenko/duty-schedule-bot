import { inject, injectable } from "inversify";
import { Types } from "../types";
import { Middleware } from "./Middleware";
import { TelegrafContext } from "telegraf/typings/context";
import { DutyScheduleStorage } from "../storages/DutyScheduleStorage";
import { SchedulerService } from "../services/SchedulerService";
import { Logger } from "winston";

@injectable()
export class DeleteScheduleMiddleware extends Middleware<TelegrafContext> {
  public constructor(
    @inject(Types.Logger)
    private logger: Logger,
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

    const chatId = chat.id;

    await this.dutyScheduleStorage.delete(chatId);
    this.schedulerService.destroyScheduler(chatId);

    this.logger.info("Current Duty Schedule was deleted.", { chatId });

    return ctx.reply(
      "The current duty schedule has been deleted. " +
        "Send /newschedule to create a new duty schedule."
    );
  }
}
