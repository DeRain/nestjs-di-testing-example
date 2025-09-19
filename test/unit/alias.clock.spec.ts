import { Test } from '@nestjs/testing';
import { CLOCK, NOW_FN } from '../../src/common/di/tokens';
import { ClockProviders, FixedClock } from '../../src/examples/alias/clock';

describe('[Alias Tokens] Clock and NowFn', () => {
  it('overriding CLOCK yields deterministic NOW_FN', async () => {
    const fixed = new Date('2020-01-01T00:00:00.000Z');
    const moduleRef = await Test.createTestingModule({ providers: [...ClockProviders] })
      .overrideProvider(CLOCK)
      .useValue(new FixedClock(fixed))
      .compile();
    const nowFn = moduleRef.get<() => Date>(NOW_FN as any);
    expect(nowFn().toISOString()).toBe('2020-01-01T00:00:00.000Z');
  });
});


