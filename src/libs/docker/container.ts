import { ExecOptions } from 'shelljs';

import * as shell from '../shell';

const baseCommand = 'docker container';

const rm = async function (
  name: string,
  options: ExecOptions,
): Promise<string> {
  const suffix = 'rm -f';

  const command = `${baseCommand} ${suffix} ${name}`;

  return shell.exec(command, options);
};

const prune = async function (options: ExecOptions): Promise<string> {
  const suffix = 'prune -f';

  const command = `${baseCommand} ${suffix}`;

  return shell.exec(command, options);
};

// ----------------------------------------
export interface IDockerLsExtrasCommand {
  all?: boolean;
}

const ls = async function (
  options: ExecOptions,
  extras: IDockerLsExtrasCommand,
): Promise<string> {
  const defaultFormat =
    "--format 'table\\t{{.Names}}\\t{{.Image}}\\t{{.Status}}\\t{{.Ports}}'";
  let suffix = `ls ${defaultFormat}`;

  if (extras.all) {
    suffix += ' -a';
  }

  const command = `${baseCommand} ${suffix}`;

  return shell.exec(command, { ...options, silent: true });
};

// ----------------------------------------

/**
 * Check if container exists
 * Return true if exists and false if not
 */
const isExists = async function (
  container_name: string,
  options: ExecOptions,
): Promise<boolean> {
  const command = `docker ps -a | grep ${container_name}`;

  let res: string;
  try {
    res = await shell.exec(command, options);
  } catch (err) {
    console.error(err);
    return false;
  }

  const parsedRes: string[] = res.split('\n');

  return parsedRes.length >= 2;
};
// ----------------------------------------
/**
 * Check if container running
 * Return true if running and false if not
 */
const isRunning = async function (
  containerName: string,
  options: ExecOptions,
): Promise<boolean> {
  const exists = await isExists(containerName, options);

  if (!exists) {
    return false;
  }

  const command = `docker container inspect -f '{{.State.Status}}' ${containerName}`;

  let res: string;
  try {
    res = await shell.exec(command, options);
  } catch (err) {
    return false;
  }

  return res.includes('running');
};

/**
 * Stop all containers
 */
const stopAll = async function (options: ExecOptions) {
  const command = 'docker kill $(docker ps -q)';

  return shell.exec(command, options);
};

/**
 * Remove all containers
 */
const removeAll = async function (options: ExecOptions) {
  const command = 'docker rm $(docker ps -a -q)';

  return shell.exec(command, options);
};

export default {
  rm,
  prune,
  ls,
  isRunning,
  stopAll,
  removeAll,
};
