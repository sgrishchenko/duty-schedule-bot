import { inject, injectable } from "inversify";
import { Middleware } from "./Middleware";
import { TelegrafContext } from "telegraf/typings/context";
import { Types } from "../types";
import { DialogStateStorage } from "../storages/DialogStateStorage";
import { DutyScheduleDraftStorage } from "../storages/DutyScheduleDraftStorage";

@injectable()
export class CancelMiddleware extends Middleware<TelegrafContext> {
  public constructor(
    @inject(Types.DialogStateStorage)
    private dialogStateStorage: DialogStateStorage,
    @inject(Types.DutyScheduleDraftStorage)
    private dutyScheduleDraftStorage: DutyScheduleDraftStorage
  ) {
    super();
  }

  public async handle(ctx: TelegrafContext) {
    const { chat } = ctx;
    if (!chat) return;

    await this.dialogStateStorage.delete(chat.id);
    await this.dutyScheduleDraftStorage.delete(chat.id);

    return ctx.reply(
      "New duty schedule creation has been canceled. " +
        "Send /newschedule to create a new duty schedule."
    );
  }
}
