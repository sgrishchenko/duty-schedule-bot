import {DutySchedule} from "../models/DutySchedule";
import {dutyScheduleStorage} from "../storages/DutyScheduleStorage";

export class Scheduler {
    private readonly startTimeout: NodeJS.Timeout;
    private handleTimeout?: NodeJS.Timeout;

    private i = 0;

    public constructor(
        private chatId: number,
        private dutySchedule: DutySchedule,
        private handleCallback: (pointer: number) => void
    ) {
        const now = new Date();

        const hoursToStart = (24 + dutySchedule.time.hours - now.getUTCHours()) % 24;
        const minutesToStart = (60 + dutySchedule.time.minutes - now.getUTCMinutes()) % 60;

        const timeToStart =
            hoursToStart * 60 * 60 * 1000
            + minutesToStart * 60 * 1000

        this.startTimeout = setTimeout(() => {
            this.planNextHandling();
        }, timeToStart)
    }

    private planNextHandling() {
        this.handleSchedule();

        if (this.i < 10) {
            this.i++;

            this.handleTimeout = setTimeout(() => {
                this.planNextHandling()
            }, 60 * 1000)
        }
    }

    private handleSchedule() {
        const {pointer, members} = this.dutySchedule;
        const nextPointer = (members.length + pointer + 1) % members.length;

        this.dutySchedule.pointer = nextPointer;
        this.handleCallback(nextPointer)

        dutyScheduleStorage.set(this.chatId, this.dutySchedule).catch(error => {
            console.log(error)
        })
    }

    public destroy() {
        clearTimeout(this.startTimeout)

        if (this.handleTimeout) {
            clearInterval(this.handleTimeout)
        }
    }
}