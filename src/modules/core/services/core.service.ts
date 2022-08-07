import fs from 'fs';

import { CommandOptions } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import shell from 'shelljs';

import config from '../../../config';
import {
  E_ATLAN_CORE_ALREADY_INITIALIZED,
  E_ATLAN_CORE_CONTEXT_DOES_NOT_CONTAIN_APPS,
  E_ATLAN_CORE_DOCKER_COMPOSE_NOT_INSTALLED,
  E_ATLAN_CORE_DOCKER_NOT_INSTALLED,
  E_ATLAN_CORE_NOT_INITIALIZED,
  E_ATLAN_CORE_NOT_RUNNING,
  E_ATLAN_CORE_NO_APP_SELECTED,
} from '../../../errors/core.errors';
import docker from '../../../libs/docker';
import contextService from '../../context/services/context.service';
import { IAtlanContextApp } from '../../context/types/atlan-context.interface';
import { EnvironmentService } from '../../environment/services/environment.service';
import { IAtlanEnvironment } from '../../environment/types/environment.interface';
import stateService from './state.service';

const environmentService = new EnvironmentService();

const init = (): boolean => {
  if (fs.existsSync(config.core.dirPath)) {
    throw E_ATLAN_CORE_ALREADY_INITIALIZED;
  }

  // Setup logger logs directory one time
  if (!fs.existsSync(config.logger.dirPath)) {
    fs.mkdirSync(config.logger.dirPath);
  }

  fs.mkdirSync(config.core.dirPath);

  contextService.init();
  stateService.init();
  environmentService.init();

  return true;
};

const start = async (
  options: CommandOptions & { env: string; verbose: boolean },
) => {
  const context = contextService.getCurrentContext();

  if (context.apps.length === 0) {
    throw E_ATLAN_CORE_CONTEXT_DOES_NOT_CONTAIN_APPS;
  }

  const { apps } = await inquirer.prompt<{ apps: IAtlanContextApp[] }>([
    {
      type: 'checkbox',
      name: 'apps',
      message: 'Which applications do you want to start ?',
      choices: context.apps.map((app) => ({
        name: app.name.charAt(0).toUpperCase() + app.name.slice(1),
        value: app,
      })),
    },
  ]);

  if (apps.length === 0) {
    throw E_ATLAN_CORE_NO_APP_SELECTED;
  }

  const spinner = ora({
    text: 'Finding apps definition\n',
  }).start();

  spinner.succeed('Finding infrastructure definition: Completed');

  let env: IAtlanEnvironment;
  if (options.env) {
    // check if env exists
    env = environmentService.findOneEnvConfig(options.env);

    if (!env) {
      console.error(`Environment "${options.env}" not found`);
      process.exit(1);
    }
  }

  let filePathList: string[];
  try {
    filePathList = apps.map((app) => {
      if (app.isDirectory) {
        return `${app.filePath}/main.yml`;
      }

      return app.filePath;
    });
  } catch (err) {
    console.log(err);
    throw err;
  }

  // spinner.start('Mounting apps\n');

  try {
    await docker.compose.up(
      filePathList,
      { ...options, env: undefined, silent: !options.verbose },
      {
        force_recreate: true,
        env_file: env ? env.filePath : null,
        project_name: 'infra',
      },
    );
  } catch (err) {
    spinner.fail('Mounting apps: Failed');

    if (options.verbose) {
      console.error(err);
    }

    process.exit(1);
  }

  spinner.succeed('Mounting apps: Completed');

  spinner.start('Saving apps definition');

  stateService.setState({
    isRunning: true,
    environmentName: env?.name,
    apps,
  });

  spinner.succeed('Saving apps definition: Completed');
};

const stop = async (
  options: CommandOptions & { verbose?: boolean },
): Promise<void> => {
  const spinner = ora({
    text: 'Loading apps definition\n',
  }).start();

  const state = stateService.getState();

  spinner.succeed('Loading apps definition: Completed');

  if (!state.isRunning) {
    throw E_ATLAN_CORE_NOT_RUNNING;
  }

  spinner.start('Unmounting apps\n');

  try {
    await docker.compose.down(
      state.apps.map(({ name }) => name),
      { ...options, env: undefined },
      {
        project_name: 'infra',
      },
    );
  } catch (err) {
    spinner.fail('Unmounting apps: Failed');

    if (options.verbose) {
      console.error(err);
    }
    process.exit(1);
  }
  spinner.succeed('Unmounting apps: Completed');

  stateService.setState({
    isRunning: false,
    environmentName: null,
    apps: [],
  });
};

const list = async ({ all }: { all: boolean }): Promise<string> => {
  console.log('🔍 Scanning all containers status :\n');

  return docker.container.ls({}, { all });
};

const destroy = (): void => {
  if (!fs.existsSync(config.core.dirPath)) {
    throw E_ATLAN_CORE_NOT_INITIALIZED;
  }

  fs.rmSync(config.core.dirPath, { recursive: true });
};

const checkDockerIsInstalled = (): boolean => {
  if (!shell.which('docker')) {
    throw E_ATLAN_CORE_DOCKER_NOT_INSTALLED;
  }

  return true;
};

const checkDockerComposeIsInstalled = (): boolean => {
  if (!shell.which('docker-compose')) {
    throw E_ATLAN_CORE_DOCKER_COMPOSE_NOT_INSTALLED;
  }

  return true;
};

export default {
  init,
  destroy,
  start,
  stop,
  list,
  checkDockerIsInstalled,
  checkDockerComposeIsInstalled,
};
