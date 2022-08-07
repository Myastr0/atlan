import { ExecOptions } from 'shelljs';

import * as shell from '../shell';

const baseCommand = 'docker network';

const create = async function (name: string, options: ExecOptions) {
  const suffix = 'create';
  const command = `${baseCommand} ${suffix} ${name}`;

  return shell.exec(command, options);
};

const prune = async function (options = {}) {
  const suffix = 'prune -f';

  const command = `${baseCommand} ${suffix}`;

  return shell.exec(command, options);
};

export default {
  create,
  prune,
};
