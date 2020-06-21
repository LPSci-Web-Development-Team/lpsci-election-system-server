/* eslint-disable import/default */
/* eslint-disable import/first */
/**
 * LPSci Web Development Team - Election API Server
 *
 * NOTE: To whomever shall follow our work, behold our art.
 * This software was Made & Crafted with love.
 * She was written to read like poetry.
 * Treat her well.
 * And when you touch this source code,
 * leave your signature below to show that you were part of its legacy.
 *
 * @author Prince Neil Cedrick Castro
 * cedi.castro@gmail.com
 */

/* NOTE: Initialize environment properties first ---------------------------- */
import dotenv from 'dotenv';

dotenv.config();

import Koa from 'koa';
import bodyParser from 'koa-body';
import helmet from 'koa-helmet';
import koaLogger from 'koa-logger';
import { createConnection } from 'typeorm';
import redis from 'redis';

import cors from '@koa/cors';

import config from './ormconfig';
import { getRootRouter } from './routes';
import { logger } from './utils/logger';
import { configureDateToJson } from './utils/time';


/* ANCHOR: Configure date to JSON ------------------------------------------- */
logger.info('Setting JSON date to ISO 8601...');
configureDateToJson();

/* ANCHOR: Setup koa server instance ---------------------------------------- */
logger.info('Instantiating server...');
const server = new Koa();
const port = Number(process.env.SERVER_PORT);
const host = process.env.SERVER_HOST;
const rootRouter = getRootRouter();

server
  // Provide security headers
  .use(helmet())

  // Use CORS protection
  .use(cors())

  // Log HTTP requests to console
  .use(koaLogger())

  // Parse JSON in request bodies
  .use(bodyParser({
    multipart: true,
  }))

  // Integrate application routes
  .use(rootRouter.routes());

/* ANCHOR: Setup redis server instance ---------------------------------------- */
logger.info('Setting up Redis server...');
const redisPort = Number(process.env.REDIS_PORT);
export const redisClient = redis.createClient(redisPort);

redisClient.on('connect', () => {
  logger.info(`Redis server listening on port ${redisPort}`);
});

redisClient.on('error', (error) => {
  logger.error('An error occurred while trying to initialize the redis server');
  logger.error(error);
  process.exit(1);
});

/* ANCHOR: Initialize TypeORM database connection --------------------------- */
logger.info('Connecting to TypeORM database...');

(async () => {
  await createConnection(config)
    .then(() => {
      logger.info('Successfully connected to the database');

      logger.info('Initializing server...');
      // Begin listening to port on host
      server.listen(port, host, () => {
        logger.info(`Server listening on port ${port}`);
      });
    })
    .catch((error) => {
      logger.error('An error occurred while trying to connect to the database');
      logger.error(error);
      process.exit(1);
    });
})()
  .catch((error) => logger.error(error));

/* ANCHOR: Setup process error handling logging ----------------------------- */
process.on('uncaughtException', (error) => {
  logger.error('An uncaughtException error has occurred.');
  logger.error(error);
});

process.on('unhandledRejection', (error) => {
  logger.error('An unhandledRejection error has occurred.');
  if (error) {
    logger.error(error);
  }
});
