import { inject, injectable } from "inversify";
import { promisify } from "util";
import redis from "redis";
import { Logger } from "winston";
import { Types } from "../types";

const REDIS_URL = process.env.REDIS_URL ?? "";
const REDIS_PASS = process.env.REDIS_PASS ?? "";

@injectable()
export class RedisService {
  public get: (key: string, field: string) => Promise<string | null>;
  public getAll: (key: string) => Promise<Record<string, string> | null>;
  public set: (key: string, field: string, value: string) => Promise<number>;
  public delete: (key: string, field: string) => Promise<number>;
  public isConnected: () => boolean;

  public constructor(@inject(Types.Logger) logger: Logger) {
    const client = redis
      .createClient({
        url: REDIS_URL,
        auth_pass: REDIS_PASS,
        connect_timeout: 10000,
      })
      .on("error", (error) => {
        logger.error(error);
      });

    this.get = promisify(client.hget).bind(client);
    this.getAll = promisify(client.hgetall).bind(client);
    this.set = promisify<string, string, string, number>(client.hset).bind(
      client
    );
    this.delete = promisify(client.hdel).bind(client);

    this.isConnected = () => client.connected;
  }
}
