import {dutyScheduleStorage} from "../storages/DutyScheduleStorage";
import {Scheduler} from "./Scheduler";
import {DutySchedule} from "../models/DutySchedule";

export type SendMessage = (chatId: number, text: string) => void

export class SchedulerService {
    private schedulers: Partial<Record<number, Scheduler>> = {}
    private sendMessage?: SendMessage

    public async init(sendMessage: SendMessage) {
        this.schedulers = {};
        this.sendMessage = sendMessage;

        const dutySchedules = await dutyScheduleStorage.getAll();

        for (const entry of Object.entries(dutySchedules)) {
            const [key, dutySchedule] = entry;
            const chatId = Number(key);

            this.createScheduler(chatId, dutySchedule);
        }
    }

    private createScheduler(chatId: number, dutySchedule: DutySchedule) {
        this.schedulers[chatId] = new Scheduler(chatId, dutySchedule, team => {
            this.sendMessage?.(chatId, 'Now on duty:\n' + team.join('\n'))
        })
    }

    public updateScheduler(chatId: number, dutySchedule: DutySchedule) {
        const existingScheduler = this.schedulers[chatId];

        if (existingScheduler) {
            existingScheduler.destroy();
            delete this.schedulers[chatId];
        }

        this.createScheduler(chatId, dutySchedule);
    }
}

export const schedulerService = new SchedulerService()
