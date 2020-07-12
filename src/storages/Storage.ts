import {hget, hset, hdel} from "../redisClient";
import {StorageKey} from "./StorageKey";

export abstract class Storage<Type> {
    protected constructor(
        private storageKey: StorageKey
    ) {
    }

    public async get(chatId: number): Promise<Type | null> {
        const reply = await hget(
            this.storageKey,
            String(chatId)
        )

        return reply !== null
            ? JSON.parse(reply)
            : null
    }


    public async set(chatId: number, entity: Type): Promise<void> {
        await hset(
            this.storageKey,
            String(chatId),
            JSON.stringify(entity)
        )
    }

    public async delete(chatId: number): Promise<void> {
        await hdel(
            this.storageKey,
            String(chatId)
        )
    }
}