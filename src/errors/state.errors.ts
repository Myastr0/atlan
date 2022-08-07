import AtlError from '../libs/AtlError.class';

export const E_ATLAN_STATE_NOT_INITIALIZED = new AtlError(
  'State is not initialized',
  'Run `atl init` to initialize state',
);

export const E_ATLAN_STATE_ALREADY_INITIALIZED = new AtlError(
  'State is already initialized',
);

export const E_ATLAN_STATE_DESTROY_CONFIRMATION_REQUIRED = new AtlError(
  'State destroy confirmation is required',
  'Run `atl destroy --confirm` to destroy state',
);
