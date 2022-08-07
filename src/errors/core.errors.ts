import AtlError from '../libs/AtlError.class';

export const E_ATLAN_CORE_NO_APP_SELECTED = new AtlError(
  'No app selected',
  'Please select at least 1 app',
);

export const E_ATLAN_CORE_ALREADY_INITIALIZED = new AtlError(
  'Already initialized',
);

export const E_ATLAN_CORE_NOT_INITIALIZED = new AtlError('Already initialized');

export const E_ATLAN_CORE_DESTROY_CONFIRMATION_REQUIRED = new AtlError(
  'Destroy confirmation required',
  'Are you sure you want to destroy Atlan ? (Run `atl destroy --confirm` to destroy state)',
);

export const E_ATLAN_CORE_DOCKER_NOT_INSTALLED = new AtlError(
  'Docker not installed',
  'Please install docker',
);

export const E_ATLAN_CORE_DOCKER_COMPOSE_NOT_INSTALLED = new AtlError(
  'Docker-compose not installed',
  'Please install docker-compose',
);

export const E_ATLAN_CORE_NOT_RUNNING = new AtlError(
  'Not running',
  "Please run 'atlan start'",
);

export const E_ATLAN_CORE_CONTEXT_DOES_NOT_CONTAIN_APPS = new AtlError(
  'Context does not contain apps',
  'Please add apps to your context',
);
