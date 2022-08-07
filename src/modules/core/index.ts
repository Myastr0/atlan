import { Command, CommandOptions } from 'commander';

import coreController from './controllers/core.controller';
import stateController from './controllers/state.controller';

export default (rootProgram: Command): Command => {
  rootProgram
    .command('init')
    .description('Initialize Atlan')
    .action(() => {
      coreController.init();
    });

  rootProgram
    .command('destroy')
    .description('Destroy Atlan')
    .requiredOption('--confirm', 'Confirm destruction')
    .action(({ confirm }: { confirm: boolean }) => {
      coreController.destroy(confirm);
    });

  rootProgram
    .command('start')
    .description('Start Atlan')
    .option('-e, --env <env>', 'Environment')
    .option('-v, --verbose', 'Verbose')
    .action(async ({ env, verbose }: { env: string; verbose: boolean }) => {
      await coreController.start({ env, verbose });
    });

  rootProgram
    .command('stop')
    .description('Stop Atlan')
    .option('-v, --verbose', 'Verbose')
    .action(async (options: CommandOptions & { verbose?: boolean }) => {
      await coreController.stop(options);
    });

  rootProgram
    .command('list')
    .alias('ls')
    .description('List all running services')
    .option('-a, --all', 'List all services')
    .action(async (options: CommandOptions & { all?: boolean }) => {
      await coreController.list({ all: options.all });
    });

  rootProgram
    .command('get status')
    .description('Get Atlan status')
    .action(() => {
      stateController.getState();
    });

  return rootProgram;
};
