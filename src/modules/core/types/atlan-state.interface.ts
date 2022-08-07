import { IAtlanContextApp } from '../../context/types/atlan-context.interface';

export interface IAtlanState {
  version: string;
  isRunning: boolean;
  currentContext: string | null;
  environmentName: string | null;
  apps: IAtlanContextApp[];
}
