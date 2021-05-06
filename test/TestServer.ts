import assert from 'assert';
import { EventEmitter } from 'events';
import { createServer, request, RequestListener, Server } from 'http';
import { Chat, MessageEntity, Opts, Telegram, Update, User, UserFromGetMe } from 'typegram';
import { promisify } from 'util';

const BOT_TOKEN = process.env.BOT_TOKEN ?? '';

export class TestServer extends EventEmitter {
  private updateId = 0;
  private messageId = 0;

  private readonly user: User = {
    id: 1234567890,
    is_bot: false,
    first_name: 'John Doe',
  };

  private readonly botUser: UserFromGetMe = {
    id: 1234567890,
    is_bot: true,
    username: 'Duty Schedule Bot',
    first_name: 'Duty Schedule Bot',
    can_join_groups: true,
    can_read_all_group_messages: false,
    supports_inline_queries: false,
  };

  private readonly chat: Chat.GroupChat = {
    id: 1234567890,
    type: 'group',
    title: 'Test Chat',
  };

  private readonly telegram: Partial<Telegram> = {
    setWebhook: () => true,

    getMe: () => this.botUser,

    sendMessage: (options) => {
      this.emit('message', options);

      return {
        message_id: this.messageId++,
        date: Date.now(),
        chat: this.chat,
        text: options.text,
        entities: options.entities,
      };
    },
  };

  private readonly server: Server;

  constructor() {
    super();
    this.server = createServer(this.requestListener);
  }

  private requestListener: RequestListener = async (request, response) => {
    assert(request.url);

    const apiMethodName = request.url.substring(request.url.lastIndexOf('/') + 1) as keyof Telegram;
    const apiMethod = this.telegram[apiMethodName];

    if (apiMethod) {
      let data = '';

      for await (const chunk of request) {
        data += String(chunk);
      }

      const body = JSON.parse(data);
      const result = apiMethod(body);
      const apiResponse = {
        ok: true,
        result,
      };

      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify(apiResponse, null, 2));
      response.end();
    } else {
      response.writeHead(404);
      response.end();
    }
  };

  public async init() {
    await promisify<number, undefined>(this.server.listen).call(this.server, 9000, undefined);
  }

  public async stop() {
    await promisify(this.server.close).call(this.server);
  }

  public async sendMessage(text: string): Promise<Opts<'sendMessage'>> {
    const entities: MessageEntity[] = [];

    if (text.startsWith('/')) {
      entities.push({
        type: 'bot_command',
        offset: 0,
        length: text.length,
      });
    }

    const update: Update.MessageUpdate = {
      update_id: this.updateId++,
      message: {
        message_id: this.updateId++,
        date: Date.now(),
        from: this.user,
        chat: this.chat,
        text,
        entities,
      },
    };

    let messageOptions: Opts<'sendMessage'> | null = null;

    this.once('message', (payload: Opts<'sendMessage'>) => {
      messageOptions = payload;
    });

    await this.sendRequest(update);

    assert(messageOptions);

    return messageOptions;
  }

  private async sendRequest(input: unknown) {
    return new Promise<void>((resolve) => {
      const clientRequest = request(
        {
          method: 'POST',
          port: 3000,
          path: `/bot${BOT_TOKEN}`,
          headers: { 'Content-Type': 'application/json' },
        },
        () => resolve(),
      );

      clientRequest.write(JSON.stringify(input, null, 2));
      clientRequest.end();
    });
  }
}
