import { AtlanContextTypeEnum } from './atlan-context-descriptor.interface';

export interface IAtlanContextApp {
  name: string;
  isDirectory: boolean;
  filePath: string;
}

export interface IAtlanContext {
  name: string;
  type: AtlanContextTypeEnum;
  path: string;
  apps: IAtlanContextApp[];
  isCurrent: boolean;
}
