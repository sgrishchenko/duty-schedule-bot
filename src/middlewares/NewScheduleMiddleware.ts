import { inject, injectable } from "inversify";
import { Types } from "../types";
import { Middleware } from "./Middleware";
import { TelegrafContext } from "telegraf/typings/context";
import { DialogStateStorage } from "../storages/DialogStateStorage";
import { DialogState } from "../models/DialogState";
import { Logger } from "winston";

@injectable()
export class NewScheduleMiddleware extends Middleware<TelegrafContext> {
  public constructor(
    @inject(Types.Logger)
    private logger: Logger,
    @inject(Types.DialogStateStorage)
    private dialogStateStorage: DialogStateStorage
  ) {
    super();
  }

  public async handle(ctx: TelegrafContext) {
    const { chat } = ctx;
    if (!chat) return;

    const chatId = chat.id;

    await this.dialogStateStorage.set(chatId, DialogState.Members);

    this.logger.info("Duty Schedule creation was started.", {
      chatId,
    });

    return ctx.reply(
      "Input a list of your team members (each name should be on a new line):",
      {
        reply_markup: {
          force_reply: true,
        },
      }
    );
  }
}
