import path from 'path';

import { Command, CommandOptions, createCommand } from 'commander';
import openEditor from 'open-editor';

import appController from '../controllers/app.controller';
import ctxController from '../controllers/context.controller';

const COMMAND_NAME = 'context';
const COMMAND_ALIAS = 'ctx';

const program = createCommand(COMMAND_NAME);

program.alias(COMMAND_ALIAS);
program.description(
  '🖼️ Context manager - This tool helps you to manage contexts',
);

export default (): Command => {
  program
    .command('list')
    .alias('ls')
    .description('List contexts')
    .action(() => {
      ctxController.listContexts();
    });

  program
    .command('current')
    .alias('cur')
    .description('Get current context')
    .option('-d, --describe', 'Describe current context')
    .action(({ describe }: { describe?: boolean }) => {
      ctxController.getCurrentContext({ describe });
    });

  program
    .command('use <context>')
    .description('Set current context')
    .option('--stay-alive', 'Stay alive after context change')
    .option('-d, --describe', 'Describe context')
    .action(
      async (
        context: string,
        { stayAlive, describe }: { stayAlive?: boolean; describe?: boolean },
      ) => {
        await ctxController.useContext(context, stayAlive, describe);
      },
    );

  program
    .command('describe <context>')
    .alias('desc')
    .description('Get context info')
    .action((context: string) => {
      ctxController.describeContext(context);
    });

  program
    .command('import <contextDirPath>')
    .description('Import context')
    .option('-n, --name <name>', 'Context name')
    .option('-f, --force', 'Force import')
    .action(
      (
        contextDirPath: string,
        { name, force }: { name?: string; force?: boolean },
      ) => {
        const absoluteContextDirPath = path.resolve(contextDirPath);

        ctxController.importContext(absoluteContextDirPath, name, force);
      },
    );

  program
    .command('remove <context>')
    .alias('rm')
    .description('Remove context')
    .action((context: string) => {
      ctxController.removeContext(context);
    });

  program
    .command('duplicate <context> [newContextName]')
    .alias('dup')
    .description('Duplicate context')
    .action((context: string, newContextName?: string) => {
      ctxController.duplicateContext(context, newContextName);
    });

  program
    .command('create <contextName>')
    .alias('c')
    .description('Create context')
    .action((contextName: string) => {
      ctxController.createContext(contextName);
    });

  program
    .command('import-app <appPath> <contextName> [appInputName]')
    .alias('ia')
    .description('Import app')
    .option('--open', 'Open app after import', false)
    .action(
      (
        appPath: string,
        contextName: string,
        appInputName?: string,
        options?: CommandOptions & { open: boolean },
      ) => {
        const app = appController.importAppInContext(
          appPath,
          contextName,
          appInputName,
        );

        if (options?.open) {
          console.log(app.filePath);
        }
      },
    );

  program
    .command('remove-app <appName> <contextName>')
    .alias('ra')
    .description('Remove app')
    .action((appName: string, contextName: string) => {
      appController.removeAppFromContext(appName, contextName);
    });
  return program;
};
