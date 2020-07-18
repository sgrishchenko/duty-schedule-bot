import { inject, injectable } from "inversify";
import { Types } from "../types";
import { Storage } from "./Storage";
import { StorageKey } from "./StorageKey";
import { RedisService } from "../services/RedisService";
import { DutySchedule } from "../models/DutySchedule";

@injectable()
export class DutyScheduleStorage extends Storage<DutySchedule> {
  public constructor(
    @inject(Types.RedisService)
    redisService: RedisService
  ) {
    super(redisService, StorageKey.DutySchedules);
  }
}
