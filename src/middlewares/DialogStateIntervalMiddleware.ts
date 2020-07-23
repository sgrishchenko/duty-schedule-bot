import { inject, injectable } from "inversify";
import { Types } from "../types";
import { Middleware } from "./Middleware";
import { DialogStateContext } from "../contexts/DialogStateContext";
import { DialogStateStorage } from "../storages/DialogStateStorage";
import { DutyScheduleDraftStorage } from "../storages/DutyScheduleDraftStorage";
import { DialogState } from "../models/DialogState";
import { IntervalView } from "../views/IntervalView";
import { Logger } from "winston";

@injectable()
export class DialogStateIntervalMiddleware extends Middleware<
  DialogStateContext
> {
  public constructor(
    @inject(Types.Logger)
    private logger: Logger,
    @inject(Types.DialogStateStorage)
    private dialogStateStorage: DialogStateStorage,
    @inject(Types.DutyScheduleDraftStorage)
    private dutyScheduleDraftStorage: DutyScheduleDraftStorage,
    @inject(Types.IntervalView)
    private intervalView: IntervalView
  ) {
    super();
  }

  public async handle(ctx: DialogStateContext, next: () => Promise<void>) {
    if (ctx.dialogState !== DialogState.Interval) {
      return next();
    }

    const chatId = ctx.chat.id;

    const draft = await this.dutyScheduleDraftStorage.get(chatId);

    const interval = this.intervalView.parse(ctx.message?.text);

    if (!interval) {
      return ctx.reply("This interval is unsupported. Please try again...", {
        reply_markup: {
          keyboard: [this.intervalView.intervalOptions],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
    }

    draft.interval = interval;

    await this.dutyScheduleDraftStorage.set(chatId, draft);
    await this.dialogStateStorage.set(chatId, DialogState.Time);

    this.logger.info("Interval was set in Duty Schedule Draft.", { chatId });

    return ctx.reply(
      "Input times of day when " +
        "the duty schedule notification should be sent (in 24:00 format):",
      {
        reply_markup: {
          force_reply: true,
        },
      }
    );
  }
}
