import { TelegrafContext } from "telegraf/typings/context";
import { DialogState } from "../models/DialogState";

export interface DialogStateContext extends TelegrafContext {
  dialogState: DialogState;
  chat: NonNullable<TelegrafContext["chat"]>;
}
