import fs from 'fs';
import path from 'path';

import config from '../../../config';
import {
  E_ATLAN_ENVIRONMENT_ALREADY_EXISTS,
  E_ATLAN_ENVIRONMENT_MODULE_ALREADY_INITIALIZED,
  E_ATLAN_ENVIRONMENT_MODULE_NOT_INITIALIZED,
  E_ATLAN_ENVIRONMENT_NOT_EXISTS,
} from '../../../errors/environment.errors';
import { IAtlanEnvironment } from '../types/environment.interface';

/**
 * @typedef IAtlanEnvironment
 *
 * @property {String} filepath - Absolute filepath of env configuration
 * @property {String} name - Name of env configuration
 */
export class EnvironmentService {
  private readonly dirPath: string;
  private readonly envFileExtension: string;
  private undeletableEnvironments: string[];

  /**
   * @param {String} dirPath - Absolute path to directory containing env files
   * @param {String} envFileExtension - File extension of env configuration
   * @param {String[]} undeletableEnvironments - List of environments that should not be deleted
   */
  constructor(
    dirPath = config.environment.dirPath,
    envFileExtension = config.environment.fileExtension,
    undeletableEnvironments: string[] = [],
  ) {
    this.dirPath = dirPath;
    this.envFileExtension = envFileExtension;
    this.undeletableEnvironments = undeletableEnvironments;
  }

  /**
   *
   * Get a list of all env configurations
   *
   * @return {IAtlanEnvironment[]}
   */
  findAllEnvConfigs(): IAtlanEnvironment[] {
    const envNames = fs.readdirSync(this.dirPath);

    return envNames.map((eName) => ({
      filePath: path.resolve(`${this.dirPath}/${eName}`),
      name: eName.replace(`.${this.envFileExtension}`, ''),
    }));
  }

  /**
   * Get one env configuration depending on input name
   *
   * @param {string} name - Name of environment
   *
   * @return {null|IAtlanEnvironment}
   */
  findOneEnvConfig(name: string) {
    const envs = this.findAllEnvConfigs();

    const i = envs.findIndex((e) => e.name === name);

    return i === -1 ? null : envs[i];
  }

  /**
   * Create environment file
   *
   * @param {string} name - Name of environment
   * @param {String} [config] - Environment configuration
   * @param {Boolean} [force] - Force creation of environment file
   *
   * @return {IAtlanEnvironment}
   */
  createEnv({
    name,
    config = '',
    force = false,
  }: {
    name: string;
    config?: string;
    force?: boolean;
  }): IAtlanEnvironment {
    if (this.findOneEnvConfig(name) !== null && !force) {
      throw E_ATLAN_ENVIRONMENT_ALREADY_EXISTS;
    }

    const filepath = `${this.dirPath}/${name}.${this.envFileExtension}`;

    fs.writeFileSync(filepath, config, 'utf8');

    return {
      name,
      filePath: path.resolve(filepath),
    };
  }

  /**
   * Move file from filepath to env configurations directories and return env configurations
   *
   * @param {String} filepath
   * @param {Boolean} force
   *
   * @return {IAtlanEnvironment| null}
   */
  importEnvFromFilePath(filepath: string, force = false): IAtlanEnvironment {
    const absoluteFilepath = path.resolve(filepath);

    if (!fs.existsSync(absoluteFilepath)) {
      throw new Error(`File at ${filepath} doesn't exists`);
    }

    const envName = path.parse(filepath).name;

    if (!force) {
      const envConfig = this.findOneEnvConfig(envName);

      if (envConfig) {
        throw E_ATLAN_ENVIRONMENT_ALREADY_EXISTS;
      }
    }

    const envFilePath = `${this.dirPath}/${envName}.${this.envFileExtension}`;

    fs.copyFileSync(filepath, envFilePath);

    return this.findOneEnvConfig(envName);
  }

  /**
   * Delete environment file
   *
   * @param {string} name - Name of environment
   *
   * @return {IAtlanEnvironment| null}
   */
  deleteEnv(name: string) {
    const envConfig = this.findOneEnvConfig(name);

    if (!envConfig) {
      throw E_ATLAN_ENVIRONMENT_NOT_EXISTS;
    }

    if (this.undeletableEnvironments.includes(envConfig.name)) {
      throw new Error(`Environment ${name} is undeletable`);
    }

    fs.unlinkSync(envConfig.filePath);

    return envConfig;
  }

  /**
   * Export environment file
   *
   * @param {string} name - Name of environment
   * @param {string} destPath - Filepath of exported file
   *
   * @return {IAtlanEnvironment| null}
   */
  exportEnv({
    name,
    destPath,
  }: {
    name: string;
    destPath: string;
  }): IAtlanEnvironment {
    const envConfig = this.findOneEnvConfig(name);

    if (!envConfig) {
      throw E_ATLAN_ENVIRONMENT_NOT_EXISTS;
    }

    fs.copyFileSync(envConfig.filePath, destPath);

    return envConfig;
  }

  init() {
    if (this.isInitialized()) {
      throw E_ATLAN_ENVIRONMENT_MODULE_ALREADY_INITIALIZED;
    }
    return fs.mkdirSync(this.dirPath, { recursive: true });
  }

  destroy() {
    if (!this.isInitialized()) {
      throw E_ATLAN_ENVIRONMENT_MODULE_NOT_INITIALIZED;
    }
    return fs.rmSync(this.dirPath, { recursive: true });
  }

  isInitialized() {
    return fs.existsSync(this.dirPath);
  }
}
