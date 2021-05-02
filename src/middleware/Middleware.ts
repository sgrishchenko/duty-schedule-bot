import { injectable } from 'inversify';
import { Context, MiddlewareFn } from 'telegraf';
import { MiddlewareObj } from 'telegraf/typings/middleware';

@injectable()
export abstract class Middleware<C extends Context> implements MiddlewareObj<C> {
  public abstract handle(...args: Parameters<MiddlewareFn<C>>): ReturnType<MiddlewareFn<C>>;

  public middleware(): MiddlewareFn<C> {
    return (ctx, next) => this.handle(ctx, next);
  }
}
