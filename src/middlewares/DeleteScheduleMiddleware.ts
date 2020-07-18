import { inject, injectable } from "inversify";
import { Types } from "../types";
import { Middleware } from "./Middleware";
import { TelegrafContext } from "telegraf/typings/context";
import { DutyScheduleStorage } from "../storages/DutyScheduleStorage";

@injectable()
export class DeleteScheduleMiddleware extends Middleware<TelegrafContext> {
  public constructor(
    @inject(Types.DutyScheduleStorage)
    private dutyScheduleStorage: DutyScheduleStorage
  ) {
    super();
  }

  public async handle(ctx: TelegrafContext) {
    const { chat } = ctx;
    if (!chat) return;

    await this.dutyScheduleStorage.delete(chat.id);

    return ctx.reply(
      "The current duty schedule has been removed. " +
        "Send /newschedule to create a new duty schedule."
    );
  }
}
