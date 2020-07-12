import {Interval} from "./Interval";

export interface DutySchedule {
    members: string[],
    interval: Interval,
    time: {
        hours: number,
        minutes: number,
    },
    pointer: number,
    teamSize: number,
}

export type DutyScheduleDraft = Partial<DutySchedule>;