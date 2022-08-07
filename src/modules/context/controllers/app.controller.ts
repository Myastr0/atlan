import ora from 'ora';

import stateService from '../../core/services/state.service';
import appService from '../services/app.service';
import contextService from '../services/context.service';
import { IAtlanContextApp } from '../types/atlan-context.interface';

const importAppInContext = (
  appPath: string,
  contextName: string,
  appInputName?: string,
): IAtlanContextApp => {
  const spinner = ora({ text: `Importing app in context ${contextName}` });

  try {
    stateService.isInitializedOrThrow();
  } catch (err) {
    spinner.fail();
    throw err;
  }

  let app: IAtlanContextApp;
  try {
    const context = contextService.getContext(contextName);
    app = appService.addAppToContext(appPath, context.path, appInputName);
  } catch (err) {
    spinner.fail();
    throw err;
  }

  spinner.succeed();

  return app;
};

const removeAppFromContext = (appName: string, contextName: string) => {
  const spinner = ora({
    text: `Removing app ${appName} from context ${contextName}`,
  });

  try {
    const context = contextService.getContext(contextName);

    appService.removeAppFromContext(appName, context);
  } catch (err) {
    spinner.fail();
    throw err;
  }

  spinner.succeed();
};
export default {
  importAppInContext,
  removeAppFromContext,
};
