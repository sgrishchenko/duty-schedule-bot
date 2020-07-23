import { Middleware } from "./Middleware";
import { TelegrafContext } from "telegraf/typings/context";
import { inject, injectable } from "inversify";
import { Types } from "../types";
import { Logger } from "winston";

@injectable()
export class HelpMiddleware extends Middleware<TelegrafContext> {
  public constructor(
    @inject(Types.Logger)
    private logger: Logger
  ) {
    super();
  }

  public async handle(ctx: TelegrafContext) {
    const chatId = ctx.chat?.id;

    this.logger.info("Help was requested.", { chatId });

    return ctx.reply(
      "This bot will help you to create a duty schedule.\n" +
        "/newschedule - create a new duty schedule\n" +
        "/currentschedule - show the current duty schedule\n" +
        "/deleteschedule - delete the current duty schedule\n" +
        "/help - show list of commands"
    );
  }
}
