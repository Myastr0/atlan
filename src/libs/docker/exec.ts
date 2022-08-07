import { ExecOptions } from 'shelljs';

import * as shell from '../shell';

interface IExecOptions extends ExecOptions {
  envs?: { [key: string]: string };
}

const exec = async (
  containerName: string,
  command: string,
  options: IExecOptions,
) => {
  let baseCommand = 'docker exec ';

  if (options.envs) {
    Object.entries(options.envs).forEach(([k, v]) => {
      baseCommand += ` --env ${k}=${v}`;
    });
  }

  baseCommand += ` ${containerName} sh -c '${command}'`;

  return shell.exec(baseCommand, options);
};

module.exports = exec;
