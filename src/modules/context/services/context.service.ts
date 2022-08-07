import fs, { writeFileSync } from 'fs';
import path from 'path';

import { copySync } from 'fs-extra';

import config from '../../../config';
import {
  E_ATLAN_CONTEXT_ALREADY_EXISTS,
  E_ATLAN_CONTEXT_DIR_NOT_EXISTS,
  E_ATLAN_CONTEXT_MODULE_ALREADY_INITIALIZED,
  E_ATLAN_CONTEXT_NOT_FOUND,
  E_ATLAN_CONTEXT_NOT_VALID,
  E_ATLAN_CURRENT_CONTEXT_NOT_DEFINED,
} from '../../../errors/context.errors';
import AtlError from '../../../libs/AtlError.class';
import stateService from '../../core/services/state.service';
import {
  AtlanContextTypeEnum,
  IAtlanContextDescriptor,
} from '../types/atlan-context-descriptor.interface';
import { IAtlanContext } from '../types/atlan-context.interface';
import appService from './app.service';

const getCurrentContext = (): IAtlanContext => {
  const state = stateService.getState();

  if (!state.currentContext) {
    throw E_ATLAN_CURRENT_CONTEXT_NOT_DEFINED;
  }

  return getContext(state.currentContext);
};

const listContexts = (): IAtlanContext[] => {
  const readdirSync = fs.readdirSync(config.context.dirPath).filter((file) => {
    return (
      fs.statSync(path.join(config.context.dirPath, file)).isDirectory() &&
      !/(^|\/)\.[^/.]/g.test(file)
    );
  });

  return readdirSync.map((contextName) => {
    const contextDirPath: string = config.context.dirPath + '/' + contextName;

    const apps = appService.findAppsByContext(contextDirPath);

    return {
      path: contextDirPath,
      name: contextName,
      type: AtlanContextTypeEnum.DIRECTORY,
      apps,
      isCurrent: isCurrentContext(contextName),
    };
  });
};

const useContext = (contextName: string): IAtlanContext => {
  const contexts = listContexts();

  const context = contexts.find((context) => context.name === contextName);

  if (!context) {
    throw E_ATLAN_CONTEXT_NOT_FOUND;
  }

  stateService.setState({ currentContext: context.name });

  return context;
};

const getContext = (contextName: string): IAtlanContext => {
  const contexts = listContexts();

  const context = contexts.find((context) => context.name === contextName);

  if (!context) {
    throw E_ATLAN_CONTEXT_NOT_FOUND;
  }

  return context;
};

const importContext = (
  contextDirPath: string,
  contextName: string,
  force?: boolean,
): IAtlanContext => {
  const dirExists = fs.existsSync(contextDirPath);

  if (!dirExists) {
    throw new Error('Context directory does not exist');
  }

  const isContextNameAlreadyUsed = listContexts().find(
    (context) => context.name === contextName,
  );

  if (isContextNameAlreadyUsed && !force) {
    throw E_ATLAN_CONTEXT_ALREADY_EXISTS;
  }

  if (!isContextValid(contextDirPath, false)) {
    throw E_ATLAN_CONTEXT_NOT_VALID;
  }

  copySync(contextDirPath, config.context.dirPath + '/' + contextName);
  createMetaFile(config.context.dirPath + '/' + contextName);

  return getContext(contextName);
};

const createMetaFile = (contextDirPath: string): void => {
  const metafilePath = contextDirPath + '/' + config.context.metafileName;
  const metafileContent: IAtlanContextDescriptor = {
    type: AtlanContextTypeEnum.DIRECTORY,
  };

  fs.writeFileSync(metafilePath, JSON.stringify(metafileContent, null, 2));
};

const isContextValid = (
  contextDirPath: string,
  needToHaveMetaFile = true,
): boolean => {
  const isContextExists = fs.existsSync(contextDirPath);

  if (!isContextExists) {
    throw E_ATLAN_CONTEXT_DIR_NOT_EXISTS;
  }

  if (needToHaveMetaFile) {
    const metaFilePath = contextDirPath + '/' + config.context.metafileName;

    const isContextContainMetaFile = fs.existsSync(metaFilePath);

    if (!isContextContainMetaFile) {
      throw E_ATLAN_CONTEXT_NOT_VALID;
    }
  }

  return true;
};

const isCurrentContext = (contextName: string): boolean => {
  const state = stateService.getState();

  return state.currentContext === contextName;
};

/**
 * Return true if state is initialized and false if not
 */
const isInitialized = (): boolean => {
  return fs.existsSync(config.context.dirPath);
};

const init = () => {
  if (isInitialized()) {
    throw E_ATLAN_CONTEXT_MODULE_ALREADY_INITIALIZED;
  }

  if (!fs.existsSync(config.context.dirPath)) {
    fs.mkdirSync(config.context.dirPath);
  }
};

const importTemplateContexts = (): void => {
  const templateContextsDirPath = config.context.templateContextsDirPath;

  const templateContexts = fs.readdirSync(templateContextsDirPath);

  templateContexts.forEach((templateContextName) => {
    const templateContextDirPath =
      templateContextsDirPath + '/' + templateContextName;

    importContext(templateContextDirPath, templateContextName);
  });
};

const describeContext = (context: IAtlanContext): void => {
  console.log(
    `Context: ${context.name} ${context.isCurrent ? '[current]' : ''}`,
  );
  console.log(`Apps: ${context.apps.map((a) => a.name).join(', ')}`);
};

const removeContext = (contextName: string): void => {
  const context = getContext(contextName);

  fs.rmSync(context.path, { recursive: true });
};

const duplicateContext = (contextName: string, newName?: string): void => {
  const context = getContext(contextName);

  let newContextName: string;
  if (!newName) {
    newContextName = context.name + '_copy';
  } else {
    newContextName = newName;
  }

  const newContextDirPath = config.context.dirPath + '/' + newContextName;

  copySync(context.path, newContextDirPath);
};

const createContext = (contextName: string): void => {
  if (isContextExists(contextName)) {
    throw E_ATLAN_CONTEXT_ALREADY_EXISTS;
  }

  const contextDirPath = config.context.dirPath + '/' + contextName;

  fs.mkdirSync(contextDirPath);

  const metaFilePath = contextDirPath + '/' + config.context.metafileName;

  const metaFileContent: IAtlanContextDescriptor = {
    type: AtlanContextTypeEnum.DIRECTORY,
  };

  // Create meta file
  fs.writeFileSync(metaFilePath, JSON.stringify(metaFileContent, null, 2));

  // Create apps directory
  fs.mkdirSync(contextDirPath + '/apps');
};

const isContextExists = (contextName: string): boolean => {
  let res: boolean;
  try {
    res = getContext(contextName) !== undefined;
  } catch (err) {
    if (
      err instanceof AtlError &&
      err.name === E_ATLAN_CONTEXT_NOT_FOUND.name
    ) {
      res = false;
    } else {
      throw err;
    }
  }

  return res;
};

export default {
  init,
  createContext,
  getCurrentContext,
  listContexts,
  useContext,
  getContext,
  isContextExists,
  importContext,
  importTemplateContexts,
  isCurrentContext,
  describeContext,
  removeContext,
  duplicateContext,
};
