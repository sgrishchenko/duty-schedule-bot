import 'dotenv/config';
import { Container } from 'inversify';
import 'reflect-metadata';
import { Logger } from 'winston';
import { logging, middleware, scheduling, storage, view } from './modules';
import { TelegrafBot } from './TelegrafBot';
import { Types } from './types';

export const container = new Container({
  defaultScope: 'Singleton',
});

container.load(logging, storage, view, middleware, scheduling);

container.bind<TelegrafBot>(Types.TelegrafBot).to(TelegrafBot);

const logger = container.get<Logger>(Types.Logger);
const bot = container.get<TelegrafBot>(Types.TelegrafBot);

bot.init().then(() => {
  logger.info('Duty Schedule Bot is started!');
});
