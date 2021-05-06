import { config } from 'dotenv';
import 'reflect-metadata';

jest.mock('redis', () => jest.requireActual('redis-mock'));

config({
  path: './.env.test',
});
