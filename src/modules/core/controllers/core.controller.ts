import { CommandOptions } from 'commander';
import ora from 'ora';

import { E_ATLAN_CORE_DESTROY_CONFIRMATION_REQUIRED } from '../../../errors/core.errors';
import coreService from '../services/core.service';

const init = () => {
  const spinner = ora({ text: 'Initializing Atlan' });

  try {
    coreService.checkDockerIsInstalled();
    coreService.checkDockerComposeIsInstalled();
  } catch (err) {
    spinner.fail();
    throw err;
  }

  coreService.init();

  spinner.succeed('Atlan initialized');
};

const destroy = (confirm: boolean) => {
  const spinner = ora({ text: 'Destroying Atlan' });

  if (!confirm) {
    spinner.fail('Destroy confirmation required');
    throw E_ATLAN_CORE_DESTROY_CONFIRMATION_REQUIRED;
  }

  coreService.destroy();

  spinner.succeed('Atlan destroyed');
};

const start = async (
  options: CommandOptions & { env: string; verbose: boolean },
) => {
  await coreService.start(options);
};

const stop = async (options: CommandOptions & { verbose?: boolean }) => {
  await coreService.stop(options);
};

const list = async (options: CommandOptions & { all: boolean }) => {
  const list = await coreService.list({ ...options });

  console.log(list);
};

export default { init, destroy, start, stop, list };
