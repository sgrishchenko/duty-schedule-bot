import { inject, injectable } from "inversify";
import { Types } from "./types";
import Telegraf from "telegraf";
import { HelpMiddleware } from "./middlewares/HelpMiddleware";
import { NewScheduleMiddleware } from "./middlewares/NewScheduleMiddleware";
import { CurrentScheduleMiddleware } from "./middlewares/CurrentScheduleMiddleware";
import { DeleteScheduleMiddleware } from "./middlewares/DeleteScheduleMiddleware";
import { DialogStateMiddleware } from "./middlewares/DialogStateMiddleware";
import { DialogStateMembersMiddleware } from "./middlewares/DialogStateMembersMiddleware";
import { DialogStateIntervalMiddleware } from "./middlewares/DialogStateIntervalMiddleware";
import { DialogStateTimeMiddleware } from "./middlewares/DialogStateTimeMiddleware";
import { DialogStateTeamSizeMiddleware } from "./middlewares/DialogStateTeamSizeMiddleware";
import { SchedulerService } from "./services/SchedulerService";
import { DialogStateContext } from "./contexts/DialogStateContext";
import { Interval } from "./models/Interval";
import { CancelMiddleware } from "./middlewares/CancelMiddleware";
import { PingService } from "./services/PingService";

const NODE_ENV = process.env.NODE_ENV ?? "development";
const PORT = Number(process.env.PORT) ?? 3000;

const BOT_TOKEN = process.env.BOT_TOKEN ?? "";
const BOT_WEBHOOK_HOST = process.env.BOT_WEBHOOK_HOST ?? "";

@injectable()
export class TelegrafBot {
  public constructor(
    @inject(Types.HelpMiddleware)
    helpMiddleware: HelpMiddleware,
    @inject(Types.CancelMiddleware)
    cancelMiddleware: CancelMiddleware,

    @inject(Types.NewScheduleMiddleware)
    newScheduleMiddleware: NewScheduleMiddleware,
    @inject(Types.CurrentScheduleMiddleware)
    currentScheduleMiddleware: CurrentScheduleMiddleware,
    @inject(Types.DeleteScheduleMiddleware)
    deleteScheduleMiddleware: DeleteScheduleMiddleware,

    @inject(Types.DialogStateMiddleware)
    dialogStateMiddleware: DialogStateMiddleware,
    @inject(Types.DialogStateMembersMiddleware)
    dialogStateMembersMiddleware: DialogStateMembersMiddleware,
    @inject(Types.DialogStateIntervalMiddleware)
    dialogStateIntervalMiddleware: DialogStateIntervalMiddleware,
    @inject(Types.DialogStateTimeMiddleware)
    dialogStateTimeMiddleware: DialogStateTimeMiddleware,
    @inject(Types.DialogStateTeamSizeMiddleware)
    dialogStateTeamSizeMiddleware: DialogStateTeamSizeMiddleware,

    @inject(Types.SchedulerService)
    schedulerService: SchedulerService,

    @inject(Types.PingService)
    pingService: PingService
  ) {
    const bot = new Telegraf<DialogStateContext>(BOT_TOKEN);

    bot.start(helpMiddleware);
    bot.help(helpMiddleware);

    bot.command("cancel", cancelMiddleware);

    bot.command("newschedule", newScheduleMiddleware);

    bot.command("currentschedule", currentScheduleMiddleware);

    bot.command("deleteschedule", deleteScheduleMiddleware);

    bot.on(
      "message",
      dialogStateMiddleware,
      dialogStateMembersMiddleware,
      dialogStateTimeMiddleware,
      dialogStateTeamSizeMiddleware
    );

    bot.action(
      Object.values(Interval),
      dialogStateMiddleware,
      dialogStateIntervalMiddleware
    );

    bot.telegram
      .setWebhook(`https://${BOT_WEBHOOK_HOST}/bot${BOT_TOKEN}`)
      .then(() => {
        if (NODE_ENV === "production") {
          console.log("Running the bot in webhook mode...");
          return bot.launch({
            webhook: {
              port: PORT,
              hookPath: `/bot${BOT_TOKEN}`,
            },
          });
        } else {
          console.log("Running the bot in long-polling mode...");
          return bot.launch();
        }
      })
      .then(() => {
        console.log("Duty Schedule Bot is started!");
      });

    schedulerService
      .init((chatId, text) => {
        bot.telegram
          .sendMessage(chatId, text, { parse_mode: "MarkdownV2" })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });

    pingService.init(() => bot.telegram.getWebhookInfo());
  }
}
