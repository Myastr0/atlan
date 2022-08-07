import fs from 'fs';

import config from '../../../config';
import {
  E_ATLAN_STATE_ALREADY_INITIALIZED,
  E_ATLAN_STATE_NOT_INITIALIZED,
} from '../../../errors/state.errors';
import { IAtlanState } from '../types/atlan-state.interface';

const INITIAL_STATE: IAtlanState = {
  version: config.version,
  isRunning: false,
  currentContext: null,
  environmentName: null,
  apps: [],
};

const STATE_FILE_DIRECTORY_PATH = config.state.dirPath;
const STATE_FILE_PATH = config.state.stateFilePath;

/**
 * Initialize state file
 */
const init = (): void => {
  if (isInitialized()) {
    throw E_ATLAN_STATE_ALREADY_INITIALIZED;
  }

  if (!fs.existsSync(STATE_FILE_DIRECTORY_PATH)) {
    fs.mkdirSync(STATE_FILE_DIRECTORY_PATH);
  }

  if (!fs.existsSync(config.state.contextsDirPath)) {
    fs.mkdirSync(config.state.contextsDirPath);
  }

  writeState(INITIAL_STATE);
};

const destroy = (): void => {
  if (!fs.existsSync(STATE_FILE_DIRECTORY_PATH)) {
    throw E_ATLAN_STATE_NOT_INITIALIZED;
  }

  fs.rmSync(STATE_FILE_DIRECTORY_PATH, { recursive: true });
};

/**
 * Return true if state is initialized and false if not
 */
const isInitialized = (): boolean => {
  if (!fs.existsSync(STATE_FILE_DIRECTORY_PATH)) {
    return false;
  }
  return fs.existsSync(STATE_FILE_PATH);
};

/**
 * Return true if state is initialized and throw error if not
 *
 * @throws {E_ATLAN_STATE_NOT_INITIALIZED}
 */
const isInitializedOrThrow = (): boolean => {
  if (!isInitialized()) {
    throw E_ATLAN_STATE_NOT_INITIALIZED;
  }

  return true;
};

/**
 * Return state from state file in JSON format
 *
 * @returns {IAtlanState}
 */
const getState = (): IAtlanState => {
  if (!fs.existsSync(STATE_FILE_PATH)) {
    throw E_ATLAN_STATE_NOT_INITIALIZED;
  }

  return JSON.parse(fs.readFileSync(STATE_FILE_PATH, 'utf8')) as IAtlanState;
};

/**
 * Update state with new values
 *
 * @param {Partial<IAtlanState>} patchStateDto
 * @returns {IAtlanState}
 */
const setState = (patchStateDto: Partial<IAtlanState>): IAtlanState => {
  const state = getState();

  // Merge old state with new state params
  const newState = {
    ...state,
    ...patchStateDto,
  };

  writeState(newState);

  return newState;
};

/**
 * Write state to state file in JSON format
 *
 * @private
 * @param {IAtlanState} state
 */
const writeState = (state: IAtlanState): void => {
  fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(state, null, 2));
};

const removeContextFromState = (): void => {
  const stateDTO: Pick<IAtlanState, 'apps' | 'currentContext'> = {
    apps: [],
    currentContext: null,
  };

  setState(stateDTO);
};

export default {
  init,
  isInitialized,
  isInitializedOrThrow,
  getState,
  setState,
  destroy,
  removeContextFromState,
};
