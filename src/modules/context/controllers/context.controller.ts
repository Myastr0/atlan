import path from 'path';

import ora from 'ora';

import { E_ATLAN_CONTEXT_NOT_FOUND } from '../../../errors/context.errors';
import docker from '../../../libs/docker';
import stateService from '../../core/services/state.service';
import contextService from '../services/context.service';
import { IAtlanContext } from '../types/atlan-context.interface';

const listContexts = (): void => {
  stateService.isInitializedOrThrow();
  const contexts = contextService.listContexts();

  if (contexts.length === 0) {
    console.log('No context found');
  } else {
    console.log('Contexts:');
    console.log(
      contexts
        .map((c) => `${c.isCurrent ? '👉' : '-'} ${c.name} [${c.type}]`)
        .join('\n'),
    );
  }
};

const getCurrentContext = ({ describe }: { describe?: boolean }): void => {
  stateService.isInitializedOrThrow();
  const context = contextService.getCurrentContext();

  if (describe) {
    contextService.describeContext(context);
  } else {
    console.log(`Current context: ${context.name}`);
  }
};

const useContext = async (
  contextName: string,
  stayAlive?: boolean,
  describe?: boolean,
): Promise<void> => {
  let spinner = ora({ text: `Checking context ${contextName} exists` });

  if (!contextService.isContextExists(contextName)) {
    spinner.fail();
    throw E_ATLAN_CONTEXT_NOT_FOUND;
  }

  spinner.succeed();
  spinner = ora({ text: `Loading Atlan state` });
  try {
    stateService.isInitializedOrThrow();
  } catch (err) {
    spinner.fail();
    throw err;
  }

  const state = stateService.getState();
  spinner.succeed();

  if (
    state.currentContext &&
    state.currentContext !== contextName &&
    state.apps.length > 0 &&
    !stayAlive
  ) {
    spinner = ora({ text: `Unmounting old context` });
    try {
      await docker.compose.down(
        state.apps.map(({ filePath }) => filePath),
        { env: undefined },
        { project_name: 'infra' },
      );

      stateService.removeContextFromState();
    } catch (err) {
      spinner.fail();
      throw err;
    }
    spinner.succeed();
  }

  spinner = ora({ text: `Using context ${contextName}` });

  try {
    contextService.useContext(contextName);
  } catch (err) {
    spinner.fail();
    throw err;
  }
  spinner.succeed();

  if (describe) {
    describeContext(contextName);
  }
};

const describeContext = (contextName: string): void => {
  const context = contextService.getContext(contextName);

  contextService.describeContext(context);
};

const duplicateContext = (
  contextName: string,
  newContextName?: string,
): void => {
  const spinner = ora({ text: `Duplicating context ${contextName}` });

  try {
    stateService.isInitializedOrThrow();
  } catch (err) {
    spinner.fail();
    throw err;
  }

  contextService.duplicateContext(contextName, newContextName);
  spinner.succeed();
};

const importContext = (
  contextDirPath: string,
  contextName?: string,
  force?: boolean,
): void => {
  let name = contextName;

  if (!name) {
    name = path.basename(contextDirPath);
  }

  const spinner = ora({ text: `Importing context ${name}` });
  try {
    contextService.importContext(contextDirPath, name, force);
  } catch (err) {
    spinner.fail();
    throw err;
  }
  spinner.succeed();
};

const removeContext = (contextName: string): void => {
  const spinner = ora({ text: `Removing context ${contextName}` });

  try {
    stateService.isInitializedOrThrow();
  } catch (err) {
    spinner.fail();
    throw err;
  }

  contextService.removeContext(contextName);
  spinner.succeed();
};

const createContext = (contextName: string): void => {
  const spinner = ora({ text: `Creating context ${contextName}` });
  try {
    contextService.createContext(contextName);
  } catch (err) {
    spinner.fail();
    throw err;
  }
  spinner.succeed();
};

export default {
  createContext,
  listContexts,
  getCurrentContext,
  useContext,
  describeContext,
  duplicateContext,
  importContext,
  removeContext,
};
