import { TelegrafContext } from "telegraf/typings/context";
import { DialogState } from "../models/DialogState";

export interface DialogStateContext extends TelegrafContext {
  dialogState: DialogState | null;
  chat: NonNullable<TelegrafContext["chat"]>;
}
