import {DutySchedule} from "../models/DutySchedule";
import {hget, hset, hdel} from "../redisClient";
import {StorageKey} from "./StorageKey";

export class DutyScheduleStorage {
    public async get(chatId: number): Promise<DutySchedule | null> {
        const reply = await hget(
            StorageKey.DutySchedules,
            String(chatId)
        )

        return reply !== null
            ? JSON.parse(reply) as DutySchedule
            : reply
    }

    public async set(chatId: number, entity: DutySchedule): Promise<void> {
        const reply = await hset(
            StorageKey.DutySchedules,
            String(chatId),
            JSON.stringify(entity)
        )

        if (reply === 0) {
            throw new Error(`Schedule for ${chatId} hasn't been added.`)
        }
    }

    public async delete(chatId: number): Promise<void> {
        await hdel(
            StorageKey.DutySchedules,
            String(chatId)
        )
    }
}

export const dutyScheduleStorage = new DutyScheduleStorage()
