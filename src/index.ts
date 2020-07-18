import "dotenv/config";
import "reflect-metadata";
import { Container } from "inversify";
import { storages, views, middlewares, scheduling } from "./modules";
import { Types } from "./types";
import { TelegrafBot } from "./TelegrafBot";

export const container = new Container({
  defaultScope: "Singleton",
});

container.load(storages, views, middlewares, scheduling);

container.bind<TelegrafBot>(Types.TelegrafBot).to(TelegrafBot);

container.get<TelegrafBot>(Types.TelegrafBot);
