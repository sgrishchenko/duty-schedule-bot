import 'dotenv/config';
import { Container } from 'inversify';
import 'reflect-metadata';
import { logging, middleware, scheduling, storage, view } from './modules';
import { TelegrafBot } from './TelegrafBot';
import { Types } from './types';

export const container = new Container({
  defaultScope: 'Singleton',
});

container.load(logging, storage, view, middleware, scheduling);

container.bind<TelegrafBot>(Types.TelegrafBot).to(TelegrafBot);

container.get<TelegrafBot>(Types.TelegrafBot);
