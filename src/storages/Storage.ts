import { StorageKey } from "./StorageKey";
import { RedisService } from "../services/RedisService";
import { injectable, unmanaged } from "inversify";

@injectable()
export abstract class Storage<Type> {
  protected constructor(
    @unmanaged() private redisService: RedisService,
    @unmanaged() private storageKey: StorageKey
  ) {}

  public async get(chatId: number): Promise<Type | null> {
    const reply = await this.redisService.get(this.storageKey, String(chatId));

    return reply !== null ? JSON.parse(reply) : null;
  }

  public async getAll(): Promise<Record<number, Type>> {
    const reply = await this.redisService.getAll(this.storageKey);

    return Object.fromEntries(
      Object.entries(reply ?? {}).map(([key, value]) => {
        return [key, JSON.parse(value)];
      })
    );
  }

  public async set(chatId: number, entity: Type): Promise<void> {
    await this.redisService.set(
      this.storageKey,
      String(chatId),
      JSON.stringify(entity)
    );
  }

  public async delete(chatId: number): Promise<void> {
    await this.redisService.delete(this.storageKey, String(chatId));
  }
}
