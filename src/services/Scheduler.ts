import {DutySchedule} from "../models/DutySchedule";

export class Scheduler {
    private readonly startTimeout: NodeJS.Timeout;
    private handleTimeout?: NodeJS.Timeout;

    private i = 0;

    public constructor(
        private chatId: number,
        private dutySchedule: DutySchedule,
        private handleCallback: (team: string[], dutySchedule: DutySchedule) => void
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
        const {pointer, members, teamSize} = this.dutySchedule;
        const team = [];

        for (let i = 0; i < Math.min(teamSize, members.length); i++) {
            const memberIndex = (members.length + pointer + i) % members.length;
            team.push(members[memberIndex])
        }

        this.dutySchedule.pointer = (members.length + pointer + 1) % members.length;

        this.handleCallback(team, this.dutySchedule)
    }

    public destroy() {
        clearTimeout(this.startTimeout)

        if (this.handleTimeout) {
            clearInterval(this.handleTimeout)
        }
    }
}