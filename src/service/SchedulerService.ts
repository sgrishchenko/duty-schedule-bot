import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { DutySchedule } from '../model/DutySchedule';
import { DutyScheduleStorage } from '../storage/DutyScheduleStorage';
import { Types } from '../types';
import { NotificationView } from '../view/NotificationView';
import { Scheduler } from './Scheduler';
import { SchedulerFactory } from './SchedulerFactory';
import { TeamService } from './TeamService';

@injectable()
export class SchedulerService {
  private schedulers: Partial<Record<number, Scheduler>> = {};
  private sendMessage: (chatId: number, text: string) => Promise<void> = () => Promise.resolve();

  public constructor(
    @inject(Types.Logger)
    private logger: Logger,
    @inject(Types.DutyScheduleStorage)
    private dutyScheduleStorage: DutyScheduleStorage,
    @inject(Types.SchedulerFactory)
    private schedulerFactory: SchedulerFactory,
    @inject(Types.TeamService)
    private teamService: TeamService,
    @inject(Types.NotificationView)
    private notificationView: NotificationView,
  ) {}

  public async init(sendMessage: SchedulerService['sendMessage']) {
    this.schedulers = {};
    this.sendMessage = sendMessage;

    const dutySchedules = await this.dutyScheduleStorage.getAll();

    for (const entry of Object.entries(dutySchedules)) {
      const [key, dutySchedule] = entry;
      const chatId = Number(key);

      this.createScheduler(chatId, dutySchedule);
    }
  }

  private createScheduler(chatId: number, dutySchedule: DutySchedule) {
    let currentSchedule = dutySchedule;

    const handleCallback = () => {
      currentSchedule = this.teamService.movePointer(currentSchedule);
      const team = this.teamService.getTeam(currentSchedule);

      this.sendMessage(chatId, this.notificationView.render(team))
        .then(() => {
          return this.dutyScheduleStorage.set(chatId, currentSchedule);
        })
        .then(() => {
          return this.logger.info('Duty Schedule was updated, notification was sent.', { chatId });
        });
    };

    this.schedulers[chatId] = this.schedulerFactory(dutySchedule, handleCallback);

    this.logger.info('Scheduler was created.', { chatId });
  }

  public destroyScheduler(chatId: number) {
    const scheduler = this.schedulers[chatId];

    if (scheduler) {
      scheduler.destroy();
      delete this.schedulers[chatId];
    }

    this.logger.info('Scheduler was destroyed.', { chatId });
  }

  public updateScheduler(chatId: number, dutySchedule: DutySchedule) {
    this.destroyScheduler(chatId);
    this.createScheduler(chatId, dutySchedule);
  }

  public async stop() {
    for (const chatId of Object.keys(this.schedulers)) {
      this.destroyScheduler(Number(chatId));
    }
  }
}
