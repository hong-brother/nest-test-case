import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { promises, readFileSync } from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';
import * as ip from 'ip';

async function bootstrap() {
  const PROTOCOL = 'http';
  const ymlPath = path.join(__filename, '..', 'configs', 'config.yml');
  const config = yaml.parse(readFileSync(ymlPath, 'utf8'));
  const httpPort =
    config[process.env.NODE_ENV || 'local']['common']['http-port'];
  const envConfig = config[process.env.NODE_ENV || 'local'];
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      level: envConfig['common']['log-level'],
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
      ],
    }),
  });

  /** Setting Swagger UI  **/
  const myIp = ip.address();
  const port = envConfig['common']['http-port'];
  app.setGlobalPrefix('api');
  app.use(compression());
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors();
  app.enableShutdownHooks(); // enable application shutdown (onModuleDestroy, beforeApplicationShutdown, onApplicationShutdown)
  await app.listen(httpPort || 3000).finally(() => {
    Logger.log(`${PROTOCOL}://${myIp}:${port}/api-docs`);
    Logger.log('start service');
  });
}

bootstrap();
