import { TelegrafContext } from 'telegraf/typings/context';
import { DialogState } from '../model/DialogState';

export interface DialogStateContext extends TelegrafContext {
  dialogState: DialogState | null;
  chat: NonNullable<TelegrafContext['chat']>;
}
