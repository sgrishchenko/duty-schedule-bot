import { injectable } from "inversify";
import { MiddlewareFn, MiddlewareObj } from "telegraf/typings/composer";
import { TelegrafContext } from "telegraf/typings/context";

@injectable()
export abstract class Middleware<Context extends TelegrafContext>
  implements MiddlewareObj<Context> {
  public abstract handle(
    ...args: Parameters<MiddlewareFn<Context>>
  ): ReturnType<MiddlewareFn<Context>>;

  public middleware(): MiddlewareFn<Context> {
    return (ctx, next) => this.handle(ctx, next);
  }
}
