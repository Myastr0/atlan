import { Command } from 'commander';

import context from './context';
import core from './core';
import environment from './environment';

export default (program: Command): void => {
  // Atach core commands to the root program
  core(program);

  // Add sub commands to the root program
  program.addCommand(context());
  program.addCommand(environment());
};
