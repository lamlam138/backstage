

import {
  errorHandler,
  notFoundHandler,
  requestLoggingHandler,
} from '@backstage/backend-common';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { Logger } from 'winston';
import { createRouter } from './router';
import { ConfigReader } from '@backstage/config';

export interface ApplicationOptions {
  enableCors: boolean;
  logger: Logger;
}

export async function createStandaloneApplication(
  options: ApplicationOptions,
): Promise<express.Application> {
  const { enableCors, logger } = options;
  const config = new ConfigReader({});
  const app = express();

  app.use(helmet());
  if (enableCors) {
    app.use(cors());
  }
  app.use(compression());
  app.use(express.json());
  app.use(requestLoggingHandler());
  app.use('/', await createRouter({ logger, config }));
  app.use(notFoundHandler());
  app.use(errorHandler());

  return app;
}
