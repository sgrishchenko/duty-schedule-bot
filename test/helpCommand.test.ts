import { configureContainer, defaultModules } from '../src/configureContainer';
import { TelegrafBot } from '../src/TelegrafBot';
import { Types } from '../src/types';
import { TestServer } from './TestServer';

describe('/help', () => {
  let server: TestServer;
  let bot: TelegrafBot;

  beforeAll(async () => {
    server = new TestServer();
    await server.init();

    const container = configureContainer(...defaultModules);
    bot = container.get<TelegrafBot>(Types.TelegrafBot);
    await bot.init();
  });

  afterAll(async () => {
    await bot.stop();
    await server.stop();
  });

  test('should respond with a message describing the commands', async () => {
    const response = await server.sendMessage('/help');
    expect(response.text).toMatchInlineSnapshot(`
      "This bot will help you to create a duty schedule.
      /newschedule - create a new duty schedule
      /currentschedule - show the current duty schedule
      /deleteschedule - delete the current duty schedule
      /help - show list of commands"
    `);
  });
});
