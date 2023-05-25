// eslint-disable-next-line import/no-extraneous-dependencies
import * as env from 'dotenv';

env.config();

process.env.NODE_ENV = process.env.NODE_ENV ?? 'testing';
process.env.PORT = process.env.PORT ?? '4000';
process.env.HOST = process.env.HOST ?? 'localhost';

jest.setTimeout(60_000);