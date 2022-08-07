import { ExecOptions } from 'shelljs';

import * as shell from '../shell';

export const cp = async (
  source: string,
  target: string,
  options = {},
): Promise<string> => {
  let baseCommand = 'docker cp';

  baseCommand += ` ${source} ${target}`;

  return shell.exec(baseCommand, options);
};

const fromContainerToHost = async (
  containerName: string,
  containerPath: string,
  hostPath: string,
  options = {},
): Promise<string> => {
  const source = `${containerName}:${containerPath}`;
  const target = `${hostPath}`;

  return cp(source, target, options);
};

const fromHostToContainer = async (
  containerName: string,
  containerPath: string,
  hostPath: string,
  options: ExecOptions,
): Promise<string> => {
  const source = `${hostPath}`;
  const target = `${containerName}:${containerPath}`;

  return cp(source, target, options);
};

export default {
  fromHostToContainer,
  fromContainerToHost,
};
