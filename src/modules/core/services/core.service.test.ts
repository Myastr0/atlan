import mock from 'mock-fs';

import config from '../../../config';
import { E_ATLAN_CORE_ALREADY_INITIALIZED } from '../../../errors/core.errors';
import coreService from './core.service';
describe('CoreService', () => {
  beforeEach(() => {
    mock();
  });

  afterEach(() => {
    mock.restore();
  });

  it('should be created', () => {
    expect(coreService).toBeTruthy();
  });

  describe('init', () => {
    it('should be able to init', () => {
      expect(coreService.init()).toBe(true);
    });
  });

  describe('init', () => {
    beforeEach(() => {
      const mockConfig = {
        [config.core.dirPath]: {
          'state.json': '{}',
        },
      };
      console.log({ mockConfig });
      mock(mockConfig);
    });

    it('should throw error if already initialized', () => {
      expect(coreService.init).toThrowError(
        E_ATLAN_CORE_ALREADY_INITIALIZED.message,
      );
    });

    afterEach(() => {
      mock.restore();
    });
  });
});
