import { inject, injectable } from "inversify";
import { Types } from "../types";
import { Middleware } from "./Middleware";
import { DialogStateContext } from "../contexts/DialogStateContext";
import { DialogStateStorage } from "../storages/DialogStateStorage";
import { DutyScheduleDraftStorage } from "../storages/DutyScheduleDraftStorage";
import { DialogState } from "../models/DialogState";
import { Logger } from "winston";

@injectable()
export class DialogStateTimeMiddleware extends Middleware<DialogStateContext> {
  public constructor(
    @inject(Types.Logger)
    private logger: Logger,
    @inject(Types.DialogStateStorage)
    private dialogStateStorage: DialogStateStorage,
    @inject(Types.DutyScheduleDraftStorage)
    private dutyScheduleDraftStorage: DutyScheduleDraftStorage
  ) {
    super();
  }

  public async handle(ctx: DialogStateContext, next: () => Promise<void>) {
    if (ctx.dialogState !== DialogState.Time) {
      return next();
    }

    const chatId = ctx.chat.id;

    const draft = await this.dutyScheduleDraftStorage.get(chatId);

    const [hours, minutes] = (ctx.message?.text ?? "").split(":").map(Number);

    if (!Number.isInteger(hours) || hours < 0 || hours > 23) {
      return ctx.reply(
        "You have input hours in a wrong format. Please try again...",
        {
          reply_markup: {
            force_reply: true,
          },
        }
      );
    }

    if (!Number.isInteger(minutes) || minutes < 0 || minutes > 59) {
      return ctx.reply(
        "You have input minutes in a wrong format. Please try again...",
        {
          reply_markup: {
            force_reply: true,
          },
        }
      );
    }

    draft.time = {
      hours,
      minutes,
    };

    await this.dutyScheduleDraftStorage.set(chatId, draft);
    await this.dialogStateStorage.set(chatId, DialogState.TeamSize);

    this.logger.info("Time was set in Duty Schedule Draft.", {
      chatId,
    });

    return ctx.reply("How many people should be on duty at a time:", {
      reply_markup: {
        force_reply: true,
      },
    });
  }
}
