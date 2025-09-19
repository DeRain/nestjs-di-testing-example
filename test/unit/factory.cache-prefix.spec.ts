import { Test } from '@nestjs/testing';
import { CACHE_KEY_PREFIX, ENVIRONMENT } from '../../src/common/di/tokens';
import { CacheKeyPrefixProvider, MinimalConfigService } from '../../src/examples/factory/cache-key-prefix.provider';

describe('[Factory] CacheKeyPrefixProvider', () => {
  const ConfigToken = Symbol('CONFIG');

  const makeConfig = (appName: string): MinimalConfigService => ({
    get: ((key: string) => (key === 'APP_NAME' ? (appName as any) : undefined)) as any,
  });

  it('computes dev prefix with env included', async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: ConfigToken, useValue: makeConfig('Demo') },
        { provide: ENVIRONMENT, useValue: 'dev' },
        CacheKeyPrefixProvider(ConfigToken),
      ],
    }).compile();

    const prefix = moduleRef.get<string>(CACHE_KEY_PREFIX as any);
    expect(prefix).toBe('demo:dev:');
  });

  it('computes prod prefix without env', async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: ConfigToken, useValue: makeConfig('Demo') },
        { provide: ENVIRONMENT, useValue: 'prod' },
        CacheKeyPrefixProvider(ConfigToken),
      ],
    }).compile();

    const prefix = moduleRef.get<string>(CACHE_KEY_PREFIX as any);
    expect(prefix).toBe('demo:');
  });
});


