import { Context } from 'telegraf';
import { DialogState } from '../model/DialogState';

export interface DialogStateContext extends Context {
  dialogState: DialogState | null;
  chat: NonNullable<Context['chat']>;
}
