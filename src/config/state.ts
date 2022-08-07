import context from './context';
import core from './core';

export default {
  dirPath: core.dirPath,
  stateFilePath: core.dirPath + '/state.json',
  contextsDirPath: context.dirPath,
};
