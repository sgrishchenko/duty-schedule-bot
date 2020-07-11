import {Period} from "./Period";

export interface DutySchedule {
    members: string[],
    period: Period,
    time: {
        hours: number,
        minutes: number,
    },
    pointer: number,
    teamSize: number,
}

export type DutyScheduleDraft = Partial<DutySchedule>;