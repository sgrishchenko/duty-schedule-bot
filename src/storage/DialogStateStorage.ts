import { inject, injectable } from 'inversify';
import { DialogState } from '../model/DialogState';
import { RedisService } from '../service/RedisService';
import { Types } from '../types';
import { Storage } from './Storage';
import { StorageKey } from './StorageKey';

@injectable()
export class DialogStateStorage extends Storage<DialogState> {
  public constructor(
    @inject(Types.RedisService)
    redisService: RedisService,
  ) {
    super(redisService, StorageKey.DialogState);
  }
}
