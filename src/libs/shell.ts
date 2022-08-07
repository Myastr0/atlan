import shell, { ExecOptions } from 'shelljs';

export const exec = (
  command: string,
  options: ExecOptions,
): Promise<string> => {
  options.async = options.async !== undefined ? options.async : true;

  return new Promise((resolve, reject) => {
    shell.exec(command, options, (code, stdout, stderr) => {
      if (code !== 0) {
        return reject(stderr);
      }
      return resolve(stdout);
    });
  });
};

export const cp = shell.cp;
