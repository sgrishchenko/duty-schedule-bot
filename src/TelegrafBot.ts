import { inject, injectable } from "inversify";
import { Types } from "./types";
import Telegraf from "telegraf";
import { createServer, RequestListener } from "http";
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
import { RedisService } from "./services/RedisService";

const NODE_ENV = process.env.NODE_ENV ?? "development";
const PORT = Number(process.env.PORT) ?? 3000;

const BOT_URL = process.env.BOT_URL ?? "";
const BOT_TOKEN = process.env.BOT_TOKEN ?? "";

@injectable()
export class TelegrafBot {
  private bot: Telegraf<DialogStateContext>;

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

    @inject(Types.RedisService)
    private redisService: RedisService,
    @inject(Types.SchedulerService)
    private schedulerService: SchedulerService
  ) {
    this.bot = new Telegraf<DialogStateContext>(BOT_TOKEN);

    this.bot.start(helpMiddleware);
    this.bot.help(helpMiddleware);

    this.bot.command("cancel", cancelMiddleware);

    this.bot.command("newschedule", newScheduleMiddleware);

    this.bot.command("currentschedule", currentScheduleMiddleware);

    this.bot.command("deleteschedule", deleteScheduleMiddleware);

    this.bot.on(
      "message",
      dialogStateMiddleware,
      dialogStateMembersMiddleware,
      dialogStateTimeMiddleware,
      dialogStateTeamSizeMiddleware
    );

    this.bot.action(
      Object.values(Interval),
      dialogStateMiddleware,
      dialogStateIntervalMiddleware
    );

    this.init().catch((error) => {
      console.log(error);
    });
  }

  private async init() {
    if (NODE_ENV === "production") {
      console.log("Running the bot in webhook mode...");

      await this.bot.telegram.setWebhook(`${BOT_URL}/bot${BOT_TOKEN}`);
      await this.bot.telegram.deleteWebhook();

      const server = createServer(this.requestListener);
      await new Promise((resolve) => server.listen(PORT, resolve));
    } else {
      console.log("Running the bot in long-polling mode...");

      await this.bot.launch();
    }

    await this.schedulerService.init((chatId, text) => {
      this.bot.telegram
        .sendMessage(chatId, text, { parse_mode: "MarkdownV2" })
        .catch((error) => {
          console.log(error);
        });
    });

    console.log("Duty Schedule Bot is started!");
  }

  private requestListener: RequestListener = (request, response) => {
    if (request.url === "/") {
      this.bot.telegram.getWebhookInfo().then((info) => {
        const result = {
          telegramIsHooked: this.bot.webhookReply,
          redisIsConnected: this.redisService.isConnected(),
        };

        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify(result, null, 2));
      });
    } else {
      this.bot.webhookCallback(`/bot${BOT_TOKEN}`)(request, response);
    }
  };
}
