import { Command, CommandOptions, createCommand } from 'commander';

import environmentController from '../controllers/environment.controller';

const COMMAND_NAME = 'environment';
const COMMAND_ALIAS = 'env';

const program = createCommand(COMMAND_NAME);

program.alias(COMMAND_ALIAS);
program.description('🗻  Environments manager - manage environments');

export default (): Command => {
  /**
   * ------------------------
   *   Environment commands
   * ------------------------
   */

  program
    .command('list')
    .alias('ls')
    .description('List environment configurations')
    .option('--verbose', 'Display all logs', false)
    .action(() => {
      environmentController.listEnvironments();
    });

  program
    .command('create')
    .alias('c')
    .requiredOption('-n, --name <name>', 'Name of environment')
    .option('--verbose', 'Display all logs', false)
    .option('-F, --force', 'Force erase existing env configuration', false)
    .action(
      (
        options: CommandOptions & {
          name: string;
          verbose: boolean;
          force: boolean;
        },
      ) => {
        environmentController.createEnvironment(
          {
            name: options.name,
          },
          { verbose: options.verbose, force: options.force },
        );
      },
    );

  program
    .command('import')
    .alias('i')
    .requiredOption(
      '-f, --file <file>',
      'Filepath of imported env configuration',
    )
    .option('--verbose', 'Display all logs', false)
    .option('-F, --force', 'Force erase of existing env configuration', false)
    .action(
      (
        options: CommandOptions & {
          file: string;
          verbose: boolean;
          force: boolean;
        },
      ) =>
        environmentController.importEnvironmentFromFile({
          file: options.file,
          verbose: options.verbose,
          force: options.force,
        }),
    );

  program
    .command('export')
    .requiredOption('-n --name <name>', 'Name of the env to export')
    .requiredOption(
      '-f, --file <file>',
      'Filepath of exported env configuration',
    )
    .option('--verbose', 'Display all logs', false)
    .action(
      (
        options: CommandOptions & {
          name: string;
          file: string;
          verbose: boolean;
        },
      ) =>
        environmentController.exportEnvironment({
          name: options.name,
          filepath: options.file,
          verbose: options.verbose,
        }),
    );

  program
    .command('remove')
    .alias('rm')
    .requiredOption('-n --name <name>', 'Name of the env to export')
    .option('--verbose', 'Display all logs', false)
    .action(
      async (options: CommandOptions & { name: string; verbose: boolean }) =>
        environmentController.deleteEnvironment({
          name: options.name,
          verbose: options.verbose,
        }),
    );
  return program;
};
