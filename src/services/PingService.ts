import { WebhookInfo } from "telegram-typings";
import { injectable } from "inversify";
import { createServer, RequestListener } from "http";

const PING_PORT = Number(process.env.PING_PORT) ?? 5000;

@injectable()
export class PingService {
  private getInfo?: () => Promise<WebhookInfo>;

  public init(getInfo: () => Promise<WebhookInfo>) {
    this.getInfo = getInfo;

    // const server = createServer(this.requestListener);
    // server.listen(PING_PORT);
  }

  private requestListener: RequestListener = (_, response) => {
    this.getInfo?.()
      .then((info) => {
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify(info, null, 2));
      })
      .catch((error: unknown) => {
        console.error(error);

        let message = "Unknown Error";
        if (error instanceof Error) {
          message = error.message;
        }

        response.statusCode = 500;
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify({ message }, null, 2));
      });
  };
}
