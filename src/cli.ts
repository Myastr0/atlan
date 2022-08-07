#!/usr/bin/env node

require('module-alias/register');

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';

import config from './config';
import AtlError from './libs/AtlError.class';
import logger from './libs/logger';

import atlan from './index';

const atlanCli = atlan();

(async (): Promise<void> => {
  clear();

  console.log(
    chalk.green(
      figlet.textSync(config.stylizedName, {
        horizontalLayout: 'full',
      }),
    ),
  );

  try {
    await atlanCli.parseAsync(process.argv);
  } catch (err) {
    if (err instanceof AtlError) {
      logger.error(chalk.red(err.message));
      if (err.helpMessage) {
        logger.warn(chalk.yellow(err.helpMessage));
      }
      process.exit(1);
    } else {
      logger.crit(err);
    }

    throw err;
  }
})();
