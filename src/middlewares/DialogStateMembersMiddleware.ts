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
export class DialogStateMembersMiddleware extends Middleware<
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
    if (ctx.dialogState !== DialogState.Members) {
      return next();
    }

    const chatId = ctx.chat.id;

    const draft = await this.dutyScheduleDraftStorage.get(chatId);

    const members = (ctx.message?.text ?? "")
      .split("\n")
      .map((member) => member.trim())
      .filter(Boolean);

    if (members.length < 0) {
      return ctx.reply(
        "You have input an empty list of team members. Please try again...",
        {
          reply_markup: {
            force_reply: true,
          },
        }
      );
    }

    draft.members = members;

    await this.dutyScheduleDraftStorage.set(chatId, draft);
    await this.dialogStateStorage.set(chatId, DialogState.Interval);

    this.logger.info("List of Members was set in Duty Schedule Draft.", {
      chatId,
    });

    return ctx.reply("Input an interval for duty schedule notifications:", {
      reply_markup: {
        keyboard: [this.intervalView.intervalOptions],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  }
}
