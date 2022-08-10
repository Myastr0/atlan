#!/usr/bin/env node

import { Command, createCommand } from 'commander';

import config from './config';
import modules from './modules';

export const createAtlanCli = (
  name = config.name,
  alias = config.alias,
): Command => {
  const atlan: Command = createCommand(name);

  atlan.alias(alias);
  atlan.description(config.description);
  atlan.version(config.version);

  modules(atlan);

  return atlan;
};
