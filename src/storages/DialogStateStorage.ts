import {DialogState} from "../models/DialogState";
import {StorageKey} from "./StorageKey";
import {Storage} from "./Storage";

export class DialogStateStorage extends Storage<DialogState> {
    constructor() {
        super(StorageKey.DialogState);
    }

    async get(chatId: number): Promise<DialogState | null> {
        return await super.get(chatId) ?? DialogState.Members;
    }
}

export const dialogStateStorage = new DialogStateStorage()
