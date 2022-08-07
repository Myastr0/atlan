import { ExecOptions } from 'shelljs';

import * as shell from '../shell';

const projectSuffixName = 'atlan';

const baseCommand = 'docker compose';

// ----------------------------------------
interface IDockerComposeRmExtrasCommand {
  project_name?: string;
}

/**
 *
 */
const rm = async function (
  filePaths: string[],
  options: ExecOptions,
  extras: IDockerComposeRmExtrasCommand,
): Promise<string> {
  let prefix = '';
  const suffix = 'rm -sf';

  if (extras.project_name) {
    prefix += ` --project-name ${projectSuffixName}-${extras.project_name}`;
  }

  const subCommand = filePaths.map((fp) => `-f ${fp}`).join(' ');
  const command = `${baseCommand} ${prefix} ${subCommand} ${suffix}`;

  return shell.exec(command, options);
};

// ----------------------------------------
interface IDockerComposeUpExtrasCommand {
  env_file?: string;
  project_name?: string;
  force_recreate?: boolean;
  no_recreate?: boolean;
}

const up = async function (
  filePaths: string[],
  options: ExecOptions,
  extras: IDockerComposeUpExtrasCommand,
): Promise<string> {
  let suffix = 'up -d ';
  let prefix = '';

  if (extras.env_file) {
    prefix += ` --env-file ${extras.env_file}`;
  }

  if (extras.project_name) {
    prefix += ` --project-name ${projectSuffixName}-${extras.project_name}`;
  }

  if (extras.force_recreate) {
    suffix += ' --force-recreate';
  }

  if (extras.no_recreate) {
    suffix += ' --no-recreate';
  }

  const subCommand = filePaths.map((fp) => `-f ${fp}`).join(' ');
  const command = `${baseCommand} ${prefix} ${subCommand} ${suffix}`;

  return shell.exec(command, { ...options });
};

// ----------------------------------------
interface IDockerComposeDownExtrasCommand {
  project_name?: string;
}

const down = async function (
  filePaths: string[],
  options: ExecOptions,
  extras: IDockerComposeDownExtrasCommand,
) {
  let prefix = '';
  const suffix = 'down';

  if (extras.project_name) {
    prefix += ` --project-name ${projectSuffixName}-${extras.project_name}`;
  }

  const subCommand = filePaths.map((fp) => `-f ${fp}`).join(' ');
  const command = `${baseCommand} ${prefix} ${subCommand} ${suffix}`;

  return shell.exec(command, { ...options });
};

// ----------------------------------------

interface IDockerComposePullExtrasCommand {
  env_file?: string;
  project_name?: string;
}

/**
 *
 * @param filePaths
 * @param {object} options
 * @param {object} extras
 * @param {string} [extras.project_name] - Name of project
 * @param {string} [extras.envFile] - Filepath of environment variables file
 * @returns {Promise<unknown>}
 */
const pull = async function (
  filePaths: string[],
  options: ExecOptions,
  extras: IDockerComposePullExtrasCommand,
) {
  const suffix = 'pull';
  let prefix = '';

  if (extras.env_file) {
    prefix += ` --env-file ${extras.env_file}`;
  }

  if (extras.project_name) {
    prefix += ` --project-name ${projectSuffixName}-${extras.project_name}`;
  }

  const subCommand = filePaths.map((fp) => `-f ${fp}`).join(' ');

  const command = `${baseCommand} ${prefix} ${subCommand} ${suffix}`;

  return shell.exec(command, { ...options });
};

export default {
  up,
  down,
  rm,
  pull,
};
