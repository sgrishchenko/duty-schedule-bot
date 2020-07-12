import 'dotenv/config'
import 'reflect-metadata'
import {Types} from "./types";
import {container} from './container'
import {TelegrafBot} from "./TelegrafBot";

container.get<TelegrafBot>(Types.TelegrafBot);
