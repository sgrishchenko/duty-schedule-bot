import {DutySchedule} from "../models/DutySchedule";
import {StorageKey} from "./StorageKey";
import {Storage} from "./Storage";

export class DutyScheduleStorage extends Storage<DutySchedule> {
    constructor() {
        super(StorageKey.DutySchedules);
    }
}

export const dutyScheduleStorage = new DutyScheduleStorage()
