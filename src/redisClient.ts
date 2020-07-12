import redis from 'redis';
import {promisify} from 'util';

const REDIS_URL = process.env.REDIS_URL ?? '';
const REDIS_PASS = process.env.REDIS_PASS ?? '';

const client = redis.createClient({
    url: REDIS_URL,
    auth_pass: REDIS_PASS,
}).on("error", error => {
    console.error(error);
});

export const hget = promisify<string, string, string | null>(client.hget).bind(client)
export const hgetall = promisify<string, Record<string, string> | null>(client.hgetall).bind(client)
export const hset = promisify<string, string, string, number>(client.hset).bind(client)
export const hdel = promisify<string, string, number>(client.hdel).bind(client)