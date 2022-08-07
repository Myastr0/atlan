#!/usr/bin/env node

import { Command, createCommand } from 'commander';

import config from './config';
import modules from './modules';

export default (name = config.name, alias = config.alias) => {
  const atlan: Command = createCommand(name);

  atlan.alias(alias);
  atlan.description(config.description);
  atlan.version(config.version);

  modules(atlan);

  return atlan;
};
