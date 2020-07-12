import {DutyScheduleDraft} from "../models/DutySchedule";
import {StorageKey} from "./StorageKey";
import {Storage} from "./Storage";

export class DutyScheduleDraftStorage extends Storage<DutyScheduleDraft> {
    public constructor() {
        super(StorageKey.DutyScheduleDrafts);
    }

    async get(chatId: number): Promise<DutyScheduleDraft> {
        return await super.get(chatId) ?? {};
    }
}

export const dutyScheduleDraftStorage = new DutyScheduleDraftStorage()
