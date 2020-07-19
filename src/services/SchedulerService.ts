import { inject, injectable } from "inversify";
import { Types } from "../types";
import { DutyScheduleStorage } from "../storages/DutyScheduleStorage";
import { DutySchedule } from "../models/DutySchedule";
import { Scheduler } from "./Scheduler";
import { NotificationView } from "../views/NotificationView";

@injectable()
export class SchedulerService {
  private schedulers: Partial<Record<number, Scheduler>> = {};
  private sendMessage?: (chatId: number, text: string) => void;

  public constructor(
    @inject(Types.DutyScheduleStorage)
    private dutyScheduleStorage: DutyScheduleStorage,
    @inject(Types.NotificationView)
    private notificationView: NotificationView
  ) {}

  public async init(sendMessage: (chatId: number, text: string) => void) {
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
    this.schedulers[chatId] = new Scheduler(
      chatId,
      dutySchedule,
      (team: string[], pointer: number) => {
        this.sendMessage?.(chatId, this.notificationView.render(team));

        dutySchedule.pointer = pointer;

        this.dutyScheduleStorage.set(chatId, dutySchedule).catch((error) => {
          console.log(error);
        });
      }
    );
  }

  public destroyScheduler(chatId: number) {
    const scheduler = this.schedulers[chatId];

    if (scheduler) {
      scheduler.destroy();
      delete this.schedulers[chatId];
    }
  }

  public updateScheduler(chatId: number, dutySchedule: DutySchedule) {
    this.destroyScheduler(chatId);
    this.createScheduler(chatId, dutySchedule);
  }
}
