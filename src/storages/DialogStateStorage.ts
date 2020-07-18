import { inject, injectable } from "inversify";
import { Types } from "../types";
import { Storage } from "./Storage";
import { StorageKey } from "./StorageKey";
import { RedisService } from "../services/RedisService";
import { DialogState } from "../models/DialogState";

@injectable()
export class DialogStateStorage extends Storage<DialogState> {
  public constructor(@inject(Types.RedisService) redisService: RedisService) {
    super(redisService, StorageKey.DialogState);
  }

  /** @override */
  public async get(chatId: number): Promise<DialogState> {
    const result = await super.get(chatId);
    return result ?? DialogState.Members;
  }
}
