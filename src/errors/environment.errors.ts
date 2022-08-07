import AtlError from '../libs/AtlError.class';

export const E_ATLAN_ENVIRONMENT_NOT_EXISTS = new AtlError(
  'Environment does not exist',
);

export const E_ATLAN_ENVIRONMENT_ALREADY_EXISTS = new AtlError(
  'Environment already exists',
  'Run `atl env list` to see available contexts',
);

export const E_ATLAN_ENVIRONMENT_MODULE_ALREADY_INITIALIZED = new AtlError(
  'Environment module already initialized',
  'Run `atl env destroy` to destroy environment module',
);

export const E_ATLAN_ENVIRONMENT_MODULE_NOT_INITIALIZED = new AtlError(
  'Environment module is not initialized',
  'Run `atl env init` to initialize environment module',
);
