import { inject, injectable } from "inversify";
import { DutyScheduleDraft } from "../model/DutySchedule";
import { RedisService } from "../service/RedisService";
import { Types } from "../types";
import { Storage } from "./Storage";
import { StorageKey } from "./StorageKey";

@injectable()
export class DutyScheduleDraftStorage extends Storage<DutyScheduleDraft> {
  public constructor(
    @inject(Types.RedisService)
    redisService: RedisService
  ) {
    super(redisService, StorageKey.DutyScheduleDrafts);
  }

  /** @override */
  public async get(chatId: number): Promise<DutyScheduleDraft> {
    const result = await super.get(chatId);
    return result ?? {};
  }
}
