import fs from 'fs';
import path from 'path';

import { copySync, removeSync } from 'fs-extra';

import {
  E_ATLAN_CONTEXT_APP_INVALID,
  E_ATLAN_CONTEXT_APP_NOT_EXISTS,
} from '../../../errors/context.errors';
import {
  IAtlanContext,
  IAtlanContextApp,
} from '../types/atlan-context.interface';

const findAppsByContext = (contextDirPath: string): IAtlanContextApp[] => {
  const appsDirPath = contextDirPath + '/apps';

  const appsName = fs.readdirSync(appsDirPath);

  return appsName
    .filter((appName) => appName.charAt(0) !== '.')
    .map((appName) => {
      const filePath = appsDirPath + '/' + appName;

      const parsedAppName = path.parse(appName).name;

      return {
        name: parsedAppName,
        filePath,
        isDirectory: fs.lstatSync(filePath).isDirectory(),
      };
    });
};

const getAppByNameAndContextPath = (
  appName: string,
  contextPath: string,
): IAtlanContextApp => {
  const apps = findAppsByContext(contextPath);

  return apps.find((app) => app.name === appName);
};

const addAppToContext = (
  appPath: string,
  contextDirPath: string,
  appInputName?: string,
): IAtlanContextApp => {
  const appName = appInputName || path.basename(appPath);

  const appDirPath = contextDirPath + '/apps/' + appName;

  if (!isValidApp(appPath)) {
    throw E_ATLAN_CONTEXT_APP_INVALID;
  }

  if (!fs.lstatSync(appPath).isDirectory()) {
    fs.mkdirSync(appDirPath);
    fs.cpSync(appPath, appDirPath + '/main.yml');
  } else {
    copySync(appPath, appDirPath);
  }

  return getAppByNameAndContextPath(appName, contextDirPath);
};

const isValidApp = (appPath: string): boolean => {
  if (!fs.existsSync(appPath)) {
    return false;
  }

  if (fs.lstatSync(appPath).isDirectory()) {
    // Should contains a main.yml file
    const mainYmlPath = appPath + '/main.yml';
    return fs.existsSync(mainYmlPath);
  } else {
    // Should be a yml file
    return appPath.endsWith('.yml');
  }
};

const removeAppFromContext = (
  appName: string,
  context: IAtlanContext,
): void => {
  if (!context.apps.find((app) => app.name === appName)) {
    throw E_ATLAN_CONTEXT_APP_NOT_EXISTS;
  }

  const appDirPath = context.path + '/apps/' + appName;

  removeSync(appDirPath);
};
export default {
  findAppsByContext,
  addAppToContext,
  removeAppFromContext,
};
