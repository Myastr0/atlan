// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pkg from '../../package.json';
import context from './context';
import core from './core';
import environment from './environment';
import logger from './logger';
import state from './state';

export default {
  name: pkg.name,
  alias: 'atl',
  stylizedName: `🔨 ${pkg.name}`,
  version: pkg.version,
  description: pkg.description,
  state,
  context,
  environment,
  core,
  logger,
};
