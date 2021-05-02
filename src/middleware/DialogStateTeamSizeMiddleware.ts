import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { DialogStateContext } from '../context/DialogStateContext';
import { DialogState } from '../model/DialogState';
import { DutySchedule } from '../model/DutySchedule';
import { SchedulerService } from '../service/SchedulerService';
import { DialogStateStorage } from '../storage/DialogStateStorage';
import { DutyScheduleDraftStorage } from '../storage/DutyScheduleDraftStorage';
import { DutyScheduleStorage } from '../storage/DutyScheduleStorage';
import { Types } from '../types';
import { DutyScheduleView } from '../view/DutyScheduleView';
import { Middleware } from './Middleware';

@injectable()
export class DialogStateTeamSizeMiddleware extends Middleware<DialogStateContext> {
  public constructor(
    @inject(Types.Logger)
    private logger: Logger,
    @inject(Types.DialogStateStorage)
    private dialogStateStorage: DialogStateStorage,
    @inject(Types.DutyScheduleDraftStorage)
    private dutyScheduleDraftStorage: DutyScheduleDraftStorage,
    @inject(Types.DutyScheduleStorage)
    private dutyScheduleStorage: DutyScheduleStorage,

    @inject(Types.SchedulerService)
    private schedulerService: SchedulerService,
    @inject(Types.DutyScheduleView)
    private dutyScheduleView: DutyScheduleView,
  ) {
    super();
  }

  public async handle(ctx: DialogStateContext, next: () => Promise<void>) {
    if (ctx.dialogState !== DialogState.TeamSize) {
      return next();
    }

    const chatId = ctx.chat.id;

    const draft = await this.dutyScheduleDraftStorage.get(chatId);

    const teamSize = Number(ctx.message?.text ?? '');

    if (!Number.isInteger(teamSize)) {
      return ctx.reply('The team size should be an integer. Please try again, or input /cancel for canceling.');
    }

    const { members, interval, time } = draft;

    if (!members || !interval || !time) {
      await this.dutyScheduleDraftStorage.delete(chatId);
      await this.dialogStateStorage.set(chatId, DialogState.Members);

      return ctx.reply(
        'Something went wrong, when you tried to describe a new duty schedule. Try starting over.\n' +
          'Input a list of your team members (each name should be on a new line):',
        {
          reply_markup: {
            force_reply: true,
          },
        },
      );
    }

    await this.dutyScheduleDraftStorage.delete(chatId);
    await this.dialogStateStorage.delete(chatId);

    const dutySchedule: DutySchedule = {
      members,
      interval,
      time,
      teamSize,
      pointer: -1, // this is initial state before the first duty
    };

    await this.dutyScheduleStorage.set(chatId, dutySchedule);
    this.schedulerService.updateScheduler(chatId, dutySchedule);

    this.logger.info('Duty Schedule was created.', {
      chatId,
    });

    return ctx.replyWithMarkdown(this.dutyScheduleView.render(dutySchedule));
  }
}
