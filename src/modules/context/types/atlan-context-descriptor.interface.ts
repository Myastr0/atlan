// Should be extend to support multiple contexts types:
// Remote: HTTP(S), Remote file systems, Github, Gitlab, Bitbucket, etc.
// Local: Directory, File
export enum AtlanContextTypeEnum {
  DIRECTORY = 'directory',
}

export interface IAtlanContextDirectoryDescriptor {
  type: AtlanContextTypeEnum.DIRECTORY;
}

export type IAtlanContextDescriptor = IAtlanContextDirectoryDescriptor;
