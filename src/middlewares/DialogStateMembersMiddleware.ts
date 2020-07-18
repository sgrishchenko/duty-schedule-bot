import { inject, injectable } from "inversify";
import { Types } from "../types";
import { Middleware } from "./Middleware";
import { DialogStateContext } from "../contexts/DialogStateContext";
import { DialogStateStorage } from "../storages/DialogStateStorage";
import { DutyScheduleDraftStorage } from "../storages/DutyScheduleDraftStorage";
import { DialogState } from "../models/DialogState";
import { IntervalView } from "../views/IntervalView";

@injectable()
export class DialogStateMembersMiddleware extends Middleware<
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
    if (ctx.dialogState !== DialogState.Members) {
      return next();
    }

    const draft = await this.dutyScheduleDraftStorage.get(ctx.chat.id);

    const members = (ctx.message?.text ?? "")
      .split("\n")
      .map((member) => member.trim())
      .filter(Boolean);

    if (members.length < 0) {
      return ctx.reply(
        "You have input an empty list of team members. Try again, please."
      );
    }

    draft.members = members;

    await this.dutyScheduleDraftStorage.set(ctx.chat.id, draft);
    await this.dialogStateStorage.set(ctx.chat.id, DialogState.Interval);

    return ctx.reply("Input an interval for duty schedule notifications:", {
      reply_markup: {
        inline_keyboard: [this.intervalView.intervalOptions],
      },
    });
  }
}
