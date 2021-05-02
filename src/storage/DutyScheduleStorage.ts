import { inject, injectable } from 'inversify';
import { DutySchedule } from '../model/DutySchedule';
import { RedisService } from '../service/RedisService';
import { Types } from '../types';
import { Storage } from './Storage';
import { StorageKey } from './StorageKey';

@injectable()
export class DutyScheduleStorage extends Storage<DutySchedule> {
  public constructor(
    @inject(Types.RedisService)
    redisService: RedisService,
  ) {
    super(redisService, StorageKey.DutySchedules);
  }
}
