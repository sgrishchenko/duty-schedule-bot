import { inject, injectable } from 'inversify';
import { Context } from 'telegraf';
import { DialogStateContext } from '../context/DialogStateContext';
import { DialogStateStorage } from '../storage/DialogStateStorage';
import { Types } from '../types';
import { Middleware } from './Middleware';

@injectable()
export class DialogStateMiddleware extends Middleware<Context> {
  public constructor(
    @inject(Types.DialogStateStorage)
    private dialogStateStorage: DialogStateStorage,
  ) {
    super();
  }

  public async handle(ctx: Context, next: () => Promise<void>) {
    const { chat } = ctx;
    if (!chat) return;

    (ctx as DialogStateContext).dialogState = await this.dialogStateStorage.get(chat.id);

    await next();
  }
}
