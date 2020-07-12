import {inject, injectable} from "inversify";
import {Types} from "../types";
import {Middleware} from "./Middleware";
import {TelegrafContext} from "telegraf/typings/context";
import {DialogStateContext} from "../contexts/DialogStateContext";
import {DialogStateStorage} from "../storages/DialogStateStorage";

@injectable()
export class DialogStateMiddleware extends Middleware<TelegrafContext> {
    public constructor(
        @inject(Types.DialogStateStorage) private dialogStateStorage: DialogStateStorage
    ) {
        super();
    }

    public async handle(ctx: TelegrafContext, next: () => Promise<void>) {
        const {chat} = ctx;
        if (!chat) return;

        (ctx as DialogStateContext).dialogState = await this.dialogStateStorage.get(chat.id)

        await next();
    }
}
