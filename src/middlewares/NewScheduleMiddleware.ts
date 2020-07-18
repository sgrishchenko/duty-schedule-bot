import { inject, injectable } from "inversify";
import { Types } from "../types";
import { Middleware } from "./Middleware";
import { TelegrafContext } from "telegraf/typings/context";
import { DialogStateStorage } from "../storages/DialogStateStorage";
import { DialogState } from "../models/DialogState";

@injectable()
export class NewScheduleMiddleware extends Middleware<TelegrafContext> {
  public constructor(
    @inject(Types.DialogStateStorage)
    private dialogStateStorage: DialogStateStorage
  ) {
    super();
  }

  public async handle(ctx: TelegrafContext) {
    const { chat } = ctx;
    if (!chat) return;

    await this.dialogStateStorage.set(chat.id, DialogState.Members);
    return ctx.reply(
      "Input a list of your team members (each name should be on a new line, input /cancel for canceling):"
    );
  }
}
