import { inject, injectable } from "inversify";
import { Types } from "../types";
import { Middleware } from "./Middleware";
import { DialogStateContext } from "../contexts/DialogStateContext";
import { DialogStateStorage } from "../storages/DialogStateStorage";
import { DutyScheduleDraftStorage } from "../storages/DutyScheduleDraftStorage";
import { DialogState } from "../models/DialogState";
import { IntervalView } from "../views/IntervalView";

@injectable()
export class DialogStateIntervalMiddleware extends Middleware<
  DialogStateContext
> {
  public constructor(
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

    const draft = await this.dutyScheduleDraftStorage.get(ctx.chat.id);

    const interval = this.intervalView.parse(ctx.message?.text);

    if (!interval) {
      return ctx.reply("This interval is unsupported. Please try again...", {
        reply_markup: {
          keyboard: [this.intervalView.intervalOptions],
          resize_keyboard: true,
        },
      });
    }

    draft.interval = interval;

    await this.dutyScheduleDraftStorage.set(ctx.chat.id, draft);
    await this.dialogStateStorage.set(ctx.chat.id, DialogState.Time);

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
