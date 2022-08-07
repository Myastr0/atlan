import config from '../config';
import AtlError from '../libs/AtlError.class';

export const E_ATLAN_CURRENT_CONTEXT_NOT_DEFINED = new AtlError(
  'Current context is not defined',
  'Run `atl context use <context-name>` to define current context',
);

export const E_ATLAN_CONTEXT_NOT_FOUND = new AtlError(
  'Context not found',
  'Run `atl context list` to see available contexts',
);

export const E_ATLAN_CONTEXT_ALREADY_EXISTS = new AtlError(
  'Context already exists',
  'Run `atl context list` to see available contexts',
);

export const E_ATLAN_IMPORTED_CONTEXT_NOT_EXISTS = new AtlError(
  'Imported context directory does not exist',
);

export const E_ATLAN_CONTEXT_NOT_VALID = new AtlError(
  'Context directory does not contain meta file',
  `Context directory must contain '${config.context.metafileName}' file`,
);

export const E_ATLAN_CONTEXT_MODULE_NOT_INITIALIZED = new AtlError(
  'Context module is not initialized',
  'Run `atl context init` to initialize context',
);

export const E_ATLAN_CONTEXT_MODULE_ALREADY_INITIALIZED = new AtlError(
  'Context module already initialized',
  'Run `atl context destroy` to destroy context',
);

export const E_ATLAN_CONTEXT_DIR_NOT_EXISTS = new AtlError(
  'Context directory does not exist',
  'Run `atl context init` to initialize context',
);

export const E_ATLAN_CONTEXT_APP_INVALID = new AtlError('App is not valid');

export const E_ATLAN_CONTEXT_APP_NOT_EXISTS = new AtlError(
  'App does not exist in context',
);
