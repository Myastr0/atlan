import ora from 'ora';

import {
  E_ATLAN_STATE_DESTROY_CONFIRMATION_REQUIRED,
  E_ATLAN_STATE_NOT_INITIALIZED,
} from '../../../errors/state.errors';
import stateService from '../services/state.service';

const initState = () => {
  const spinner = ora({ text: 'Initializing Atlan' });
  stateService.init();

  spinner.succeed('Atlan initialized');
};

const destroyState = (confirm: boolean) => {
  if (!confirm) {
    throw E_ATLAN_STATE_DESTROY_CONFIRMATION_REQUIRED;
  }

  stateService.destroy();
};

const getState = () => {
  stateService.isInitializedOrThrow();

  const state = stateService.getState();

  console.log(JSON.stringify(state, null, 2));
};

export default { initState, destroyState, getState };
