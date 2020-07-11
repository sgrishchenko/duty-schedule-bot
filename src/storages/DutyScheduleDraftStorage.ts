import {DutyScheduleDraft} from "../models/DutySchedule";
import {hget, hset, hdel} from "../redisClient";
import {StorageKey} from "./StorageKey";

export class DutyScheduleDraftStorage {
    public async get(chatId: number): Promise<DutyScheduleDraft> {
        const reply = await hget(
            StorageKey.DutyScheduleDrafts,
            String(chatId)
        )

        return reply !== null
            ? JSON.parse(reply) as DutyScheduleDraft
            : {}
    }

    public async set(chatId: number, entity: DutyScheduleDraft): Promise<void> {
        const reply = await hset(
            StorageKey.DutyScheduleDrafts,
            String(chatId),
            JSON.stringify(entity)
        )

        if (reply === 0) {
            throw new Error(`Schedule Draft for ${chatId} hasn't been added.`)
        }
    }

    public async delete(chatId: number): Promise<void> {
        await hdel(
            StorageKey.DutyScheduleDrafts,
            String(chatId)
        )
    }
}

export const dutyScheduleDraftStorage = new DutyScheduleDraftStorage()
