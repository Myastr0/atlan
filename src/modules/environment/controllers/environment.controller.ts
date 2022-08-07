import ora from 'ora';
import shell from 'shelljs';

import { EnvironmentService } from '../services/environment.service';
import { ICreateEnvironmentDto } from '../types/create-environment.dto';
import { IAtlanEnvironment } from '../types/environment.interface';

const environmentService = new EnvironmentService();

const listEnvironments = () => {
  const envs = environmentService.findAllEnvConfigs();

  console.log('🔍 List of environment availables:\n');

  envs.forEach((e) => {
    console.log(`> ${e.name}`);
  });
};

const createEnvironment = (
  { name }: ICreateEnvironmentDto,
  { verbose, force }: { verbose: boolean; force: boolean },
) => {
  const spinner = ora({
    text: 'Creating environment file:\n',
  }).start();

  let env: IAtlanEnvironment;

  try {
    env = environmentService.createEnv({ name });
  } catch (err) {
    spinner.fail('Creating environment file: Failed');

    if (verbose) {
      console.error(err);
    }
    shell.exit(1);
  }

  spinner.succeed('Creating environment file: Completed');
  console.log(
    `\nYou can edit environment configuration file at: \n${env.filePath}`,
  );
};

const importEnvironmentFromFile = ({
  file,
  verbose,
  force,
}: {
  file: string;
  verbose: boolean;
  force: boolean;
}) => {
  const spinner = ora({
    text: 'Adding environment file:\n',
  }).start();

  let env: IAtlanEnvironment;

  try {
    env = environmentService.importEnvFromFilePath(file, force);
  } catch (err) {
    spinner.fail('Adding environment file: Failed');

    if (verbose) {
      console.error(err);
    }
    shell.exit(1);
  }

  spinner.succeed('Adding environment file: Completed');
  console.log(
    `\nYou can edit environment configuration file at: \n${env.filePath}`,
  );
};

const deleteEnvironment = ({
  name,
  verbose,
}: {
  name: string;
  verbose: boolean;
}) => {
  const spinner = ora({
    text: 'Deleting environment file:\n',
  }).start();

  try {
    environmentService.deleteEnv(name);
  } catch (err) {
    spinner.fail('Deleting environment file: Failed');

    if (verbose) {
      console.error(err);
    }
    process.exit(1);
  }

  spinner.succeed('Deleting environment file: Completed');
};

const exportEnvironment = ({
  name,
  filepath,
  verbose,
}: {
  name: string;
  filepath: string;
  verbose: boolean;
}) => {
  const spinner = ora({
    text: 'Exporting environment file:\n',
  }).start();

  try {
    environmentService.exportEnv({ name, destPath: filepath });
  } catch (err) {
    spinner.fail('Exporting environment file: Failed');

    if (verbose) {
      console.error(err);
    }
    process.exit(1);
  }

  spinner.succeed('Exporting environment file: Completed');
};

export default {
  listEnvironments,
  createEnvironment,
  importEnvironmentFromFile,
  deleteEnvironment,
  exportEnvironment,
};
