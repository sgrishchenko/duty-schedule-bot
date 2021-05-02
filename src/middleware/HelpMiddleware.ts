import { inject, injectable } from 'inversify';
import { Context } from 'telegraf';
import { Logger } from 'winston';
import { Types } from '../types';
import { Middleware } from './Middleware';

@injectable()
export class HelpMiddleware extends Middleware<Context> {
  public constructor(
    @inject(Types.Logger)
    private logger: Logger,
  ) {
    super();
  }

  public async handle(ctx: Context) {
    const chatId = ctx.chat?.id;

    this.logger.info('Help was requested.', { chatId });

    return ctx.reply(
      'This bot will help you to create a duty schedule.\n' +
        '/newschedule - create a new duty schedule\n' +
        '/currentschedule - show the current duty schedule\n' +
        '/deleteschedule - delete the current duty schedule\n' +
        '/help - show list of commands',
    );
  }
}
