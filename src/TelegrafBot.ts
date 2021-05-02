import { createServer, RequestListener } from 'http';
import { inject, injectable } from 'inversify';
import Telegraf from 'telegraf';
import { Logger } from 'winston';
import { DialogStateContext } from './context/DialogStateContext';
import { CurrentScheduleMiddleware } from './middleware/CurrentScheduleMiddleware';
import { DeleteScheduleMiddleware } from './middleware/DeleteScheduleMiddleware';
import { DialogStateIntervalMiddleware } from './middleware/DialogStateIntervalMiddleware';
import { DialogStateMembersMiddleware } from './middleware/DialogStateMembersMiddleware';
import { DialogStateMiddleware } from './middleware/DialogStateMiddleware';
import { DialogStateTeamSizeMiddleware } from './middleware/DialogStateTeamSizeMiddleware';
import { DialogStateTimeMiddleware } from './middleware/DialogStateTimeMiddleware';
import { HelpMiddleware } from './middleware/HelpMiddleware';
import { NewScheduleMiddleware } from './middleware/NewScheduleMiddleware';
import { RedisService } from './service/RedisService';
import { SchedulerService } from './service/SchedulerService';
import { Types } from './types';

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const PORT = Number(process.env.PORT) ?? 3000;

const BOT_URL = process.env.BOT_URL ?? '';
const BOT_TOKEN = process.env.BOT_TOKEN ?? '';

@injectable()
export class TelegrafBot {
  private bot: Telegraf<DialogStateContext>;

  public constructor(
    @inject(Types.Logger)
    private logger: Logger,

    @inject(Types.HelpMiddleware)
    helpMiddleware: HelpMiddleware,

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
    private schedulerService: SchedulerService,
  ) {
    this.bot = new Telegraf<DialogStateContext>(BOT_TOKEN, {
      username: 'DutyScheduleBot',
    });

    this.bot.start(helpMiddleware);
    this.bot.help(helpMiddleware);

    this.bot.command('newschedule', newScheduleMiddleware);

    this.bot.command('currentschedule', currentScheduleMiddleware);

    this.bot.command('deleteschedule', deleteScheduleMiddleware);

    this.bot.on(
      'message',
      dialogStateMiddleware,
      dialogStateMembersMiddleware,
      dialogStateIntervalMiddleware,
      dialogStateTimeMiddleware,
      dialogStateTeamSizeMiddleware,
    );

    this.bot.catch((error: unknown) => {
      this.logger.error(error);
    });

    this.init().then(() => {
      this.logger.info('Duty Schedule Bot is started!');
    });
  }

  private async init() {
    if (NODE_ENV === 'production') {
      this.logger.info('Running the bot in webhook mode...');

      await this.bot.telegram.setWebhook(`${BOT_URL}/bot${BOT_TOKEN}`);

      const server = createServer(this.requestListener);
      await new Promise((resolve) => server.listen(PORT, resolve));
    } else {
      this.logger.info('Running the bot in long-polling mode...');

      await this.bot.launch();
    }

    await this.schedulerService.init(this.sendMessage);
  }

  private requestListener: RequestListener = (request, response) => {
    if (request.url === '/') {
      this.bot.telegram.getWebhookInfo().then((webhookInfo) => {
        const result = {
          telegramIsHooked: webhookInfo.url.includes(BOT_URL),
          redisIsConnected: this.redisService.isConnected(),
        };

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(result, null, 2));
      });
    } else {
      this.bot.webhookCallback(`/bot${BOT_TOKEN}`)(request, response);
    }
  };

  private sendMessage = async (chatId: number, text: string) => {
    await this.bot.telegram.sendMessage(chatId, text, {
      parse_mode: 'MarkdownV2',
    });
  };
}
