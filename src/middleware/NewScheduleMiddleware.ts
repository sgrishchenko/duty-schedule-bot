import { inject, injectable } from 'inversify';
import { Context } from 'telegraf';
import { Logger } from 'winston';
import { DialogState } from '../model/DialogState';
import { DialogStateStorage } from '../storage/DialogStateStorage';
import { Types } from '../types';
import { Middleware } from './Middleware';

@injectable()
export class NewScheduleMiddleware extends Middleware<Context> {
  public constructor(
    @inject(Types.Logger)
    private logger: Logger,
    @inject(Types.DialogStateStorage)
    private dialogStateStorage: DialogStateStorage,
  ) {
    super();
  }

  public async handle(ctx: Context) {
    const { chat } = ctx;
    if (!chat) return;

    const chatId = chat.id;

    await this.dialogStateStorage.set(chatId, DialogState.Members);

    this.logger.info('Duty Schedule creation was started.', {
      chatId,
    });

    return ctx.reply('Input a list of your team members (each name should be on a new line):', {
      reply_markup: {
        force_reply: true,
      },
    });
  }
}
