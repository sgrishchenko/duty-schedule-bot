import 'dotenv/config';
import 'reflect-metadata';
import { Logger } from 'winston';
import { configureContainer, defaultModules } from './configureContainer';
import { TelegrafBot } from './TelegrafBot';
import { Types } from './types';

export const container = configureContainer(...defaultModules);

const logger = container.get<Logger>(Types.Logger);
const bot = container.get<TelegrafBot>(Types.TelegrafBot);

bot.init().then(() => {
  logger.info('Duty Schedule Bot is started!');
});
