import { ExecOptions } from 'shelljs';

import * as shell from '../shell';

const rm = async (
  volumeName: string,
  options: ExecOptions,
): Promise<string> => {
  const baseCommand = `docker volume rm ${volumeName}`;

  return shell.exec(baseCommand, options);
};

const create = async (volumeName: string, options: ExecOptions) => {
  const baseCommand = `docker volume create ${volumeName}`;

  return shell.exec(baseCommand, options);
};

export default {
  rm,
  create,
};
