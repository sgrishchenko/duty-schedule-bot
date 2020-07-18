import { inject, injectable } from "inversify";
import { Types } from "../types";
import { Middleware } from "./Middleware";
import { TelegrafContext } from "telegraf/typings/context";
import { DutyScheduleStorage } from "../storages/DutyScheduleStorage";

@injectable()
export class CurrentScheduleMiddleware extends Middleware<TelegrafContext> {
  public constructor(
    @inject(Types.DutyScheduleStorage)
    private dutyScheduleStorage: DutyScheduleStorage
  ) {
    super();
  }

  public async handle(ctx: TelegrafContext) {
    const { chat } = ctx;
    if (!chat) return;

    const dutySchedule = await this.dutyScheduleStorage.get(chat.id);

    if (!dutySchedule) {
      return ctx.reply(
        "There is no duty schedule yet. " +
          "Send /newschedule to create a new duty schedule."
      );
    }

    return ctx.reply(JSON.stringify(dutySchedule, null, 2));
  }
}
