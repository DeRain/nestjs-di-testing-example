import { Module } from '@nestjs/common';
import { CACHE_KEY_PREFIX, ENVIRONMENT } from '../../common/di/tokens';
import { CacheKeyPrefixProvider, MinimalConfigService } from './cache-key-prefix.provider';

const CONFIG_TOKEN = Symbol('CONFIG');

const demoConfig: MinimalConfigService = {
  get: ((key: string) => (key === 'APP_NAME' ? ('DemoApp' as any) : undefined)) as any,
};

@Module({
  providers: [
    { provide: CONFIG_TOKEN, useValue: demoConfig },
    { provide: ENVIRONMENT, useValue: 'dev' },
    CacheKeyPrefixProvider(CONFIG_TOKEN),
  ],
  exports: [CACHE_KEY_PREFIX],
})
export class CacheKeyPrefixUsageModule {}


