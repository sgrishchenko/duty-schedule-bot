import {TelegrafContext} from "telegraf/typings/context";
import {MiddlewareObj, MiddlewareFn} from "telegraf/typings/composer";
import {injectable} from "inversify";

@injectable()
export abstract class Middleware<Context extends TelegrafContext> implements MiddlewareObj<Context> {
    public abstract handle(...args: Parameters<MiddlewareFn<Context>>): ReturnType<MiddlewareFn<Context>>;

    public middleware(): MiddlewareFn<Context> {
        return (ctx, next) => this.handle(ctx, next);
    }
}