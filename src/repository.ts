import redis from 'redis';
import {promisify} from 'util';

const REDIS_URL = process.env.REDIS_URL ?? '';
const REDIS_PASS = process.env.REDIS_PASS ?? '';

const client = redis.createClient({
    url: REDIS_URL,
    auth_pass: REDIS_PASS,
});

client.on("error", error => {
    console.error(error);
});

// client.set("key", "value", redis.print);
client.get("key", redis.print);
