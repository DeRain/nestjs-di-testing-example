import { Provider } from '@nestjs/common';
import { CACHE_KEY_PREFIX, ENVIRONMENT } from '../../common/di/tokens';

export interface MinimalConfigService {
  get<T = any>(key: string, defaultValue?: T): T | undefined;
}

export const CacheKeyPrefixProvider = (configToken: any): Provider => ({
  provide: CACHE_KEY_PREFIX,
  useFactory: (config: MinimalConfigService, env: string) => {
    const app = (config.get<string>('APP_NAME') || 'app').toLowerCase();
    const base = env === 'prod' ? app : `${app}:${env}`;
    return `${base}:`;
  },
  inject: [configToken, ENVIRONMENT],
});


