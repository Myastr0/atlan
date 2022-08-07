import os from 'os';

const homedir = os.homedir();

export default {
  dirPath: homedir + '/.atlan-logs',
};
