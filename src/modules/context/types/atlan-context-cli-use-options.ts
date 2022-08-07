import { CommandOptions } from 'commander';

export interface IAtlanContextCliUseOptions extends CommandOptions {
  context: string;
}
