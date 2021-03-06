import { inject, injectable } from 'inversify';
import { Context } from 'telegraf';
import { Logger } from 'winston';
import { SchedulerService } from '../service/SchedulerService';
import { DutyScheduleStorage } from '../storage/DutyScheduleStorage';
import { Types } from '../types';
import { Middleware } from './Middleware';

@injectable()
export class DeleteScheduleMiddleware extends Middleware<Context> {
  public constructor(
    @inject(Types.Logger)
    private logger: Logger,
    @inject(Types.DutyScheduleStorage)
    private dutyScheduleStorage: DutyScheduleStorage,

    @inject(Types.SchedulerService)
    private schedulerService: SchedulerService,
  ) {
    super();
  }

  public async handle(ctx: Context) {
    const { chat } = ctx;
    if (!chat) return;

    const chatId = chat.id;

    await this.dutyScheduleStorage.delete(chatId);
    this.schedulerService.destroyScheduler(chatId);

    this.logger.info('Current Duty Schedule was deleted.', { chatId });

    return ctx.reply('The current duty schedule has been deleted. Send /newschedule to create a new duty schedule.');
  }
}
