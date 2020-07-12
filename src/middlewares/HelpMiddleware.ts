import {Middleware} from "./Middleware";
import {TelegrafContext} from "telegraf/typings/context";
import {injectable} from "inversify";

@injectable()
export class HelpMiddleware extends Middleware<TelegrafContext> {
    public async handle(ctx: TelegrafContext) {
        return ctx.reply(
            'This bot will help you to create a duty schedule.\n' +
            '/newschedule - create a new duty schedule\n' +
            '/currentschedule - show the current duty schedule\n' +
            '/deleteschedule - delete the current duty schedule\n' +
            '/help - show list of commands'
        );
    }
}
