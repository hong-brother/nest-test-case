import * as os from 'os';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { Logger } from '@nestjs/common';
import * as ip from 'ip';

const YAML_CONFIG_FILENAME = 'config.yml';
const PROTOCOL = 'http';

export default () => {
  const config = yaml.load(
    fs.readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
  );
  const port = config[process.env.NODE_ENV || 'local']['common']['http-port'];
  const myIp = ip.address();
  // initialize
  Logger.log(
    '\n' +
      '                           888         888                     888                                             \n' +
      '                           888         888                     888                                             \n' +
      '                           888         888                     888                                             \n' +
      '88888b.   .d88b.  .d8888b  888888      888888 .d88b.  .d8888b  888888       .d8888b  8888b.  .d8888b   .d88b.  \n' +
      '888 "88b d8P  Y8b 88K      888         888   d8P  Y8b 88K      888         d88P"        "88b 88K      d8P  Y8b \n' +
      '888  888 88888888 "Y8888b. 888  888888 888   88888888 "Y8888b. 888  888888 888      .d888888 "Y8888b. 88888888 \n' +
      '888  888 Y8b.          X88 Y88b.       Y88b. Y8b.          X88 Y88b.       Y88b.    888  888      X88 Y8b.     \n' +
      '888  888  "Y8888   88888P\'  "Y888       "Y888 "Y8888   88888P\'  "Y888       "Y8888P "Y888888  88888P\'  "Y8888  \n' +
      '\n' +
      '',
  );
  Logger.log(
    '========================================================================================================',
  );
  Logger.log(`node version: ${process.version}`);
  Logger.log(`node env: ${process.env.NODE_ENV || 'local'}`);
  Logger.log(`cpu core: ${os.cpus().length}`);
  Logger.log(`host platform: ${process.platform}`);
  Logger.log(`host architecture: ${process.arch}`);
  Logger.log(`hostname: ${os.hostname()}`);
  Logger.log(`user home: ${os.userInfo().username}`);
  Logger.log(`user home directory: ${os.userInfo().homedir}`);
  Logger.log(`api ip: ${myIp}`);
  Logger.log(`${PROTOCOL}://${myIp}:${port}/api-docs`);
  Logger.log(
    '========================================================================================================',
  );

  return config;
};
