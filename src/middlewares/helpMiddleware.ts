import {Middleware} from "telegraf";
import {TelegrafContext} from "telegraf/typings/context";

export const helpMiddleware: Middleware<TelegrafContext> = async ctx => {
    return ctx.reply(
        'This bot will help you to create a duty schedule.\n' +
        '/newschedule - create a new duty schedule\n' +
        '/currentschedule - show the current duty schedule\n' +
        '/deleteschedule - delete the current duty schedule\n' +
        '/help - show list of commands'
    );
}
