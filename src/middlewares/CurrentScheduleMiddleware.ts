import { inject, injectable } from "inversify";
import { Types } from "../types";
import { Middleware } from "./Middleware";
import { TelegrafContext } from "telegraf/typings/context";
import { DutyScheduleStorage } from "../storages/DutyScheduleStorage";
import { DutyScheduleView } from "../views/DutyScheduleView";
import { Logger } from "winston";

@injectable()
export class CurrentScheduleMiddleware extends Middleware<TelegrafContext> {
  public constructor(
    @inject(Types.Logger)
    private logger: Logger,
    @inject(Types.DutyScheduleStorage)
    private dutyScheduleStorage: DutyScheduleStorage,
    @inject(Types.DutyScheduleView)
    private dutyScheduleView: DutyScheduleView
  ) {
    super();
  }

  public async handle(ctx: TelegrafContext) {
    const { chat } = ctx;
    if (!chat) return;

    const chatId = chat.id;

    const dutySchedule = await this.dutyScheduleStorage.get(chatId);

    this.logger.info("Current Duty Schedule was requested.", { chatId });

    if (!dutySchedule) {
      return ctx.reply(
        "There is no duty schedule yet. " +
          "Send /newschedule to create a new duty schedule."
      );
    }

    return ctx.replyWithMarkdown(this.dutyScheduleView.render(dutySchedule));
  }
}
