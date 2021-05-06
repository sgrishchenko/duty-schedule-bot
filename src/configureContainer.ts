import { Container, ContainerModule } from 'inversify';
import { logging, middleware, scheduling, storage, view } from './modules';
import { TelegrafBot } from './TelegrafBot';
import { Types } from './types';

export const defaultModules = [logging, storage, view, middleware, scheduling];

export const configureContainer = (...modules: ContainerModule[]) => {
  const container = new Container({
    defaultScope: 'Singleton',
  });

  container.load(...modules);

  container.bind<TelegrafBot>(Types.TelegrafBot).to(TelegrafBot);

  return container;
};
