import { Test } from '@nestjs/testing';
import { OptionalMetricsUserService } from '../../src/examples/moduleref/optional.service';
import { METRICS } from '../../src/common/di/tokens';

describe('[ModuleRef Optional] resolves metrics optionally', () => {
  it('works without metrics registered', async () => {
    const moduleRef = await Test.createTestingModule({ providers: [OptionalMetricsUserService] }).compile();
    const svc = moduleRef.get(OptionalMetricsUserService);
    expect(svc.doWork()).toBe('done');
  });

  it('uses metrics when registered', async () => {
    const inc = jest.fn();
    const moduleRef = await Test.createTestingModule({
      providers: [OptionalMetricsUserService, { provide: METRICS, useValue: { increment: inc, gauge: jest.fn() } }],
    }).compile();
    const svc = moduleRef.get(OptionalMetricsUserService);
    svc.doWork();
    expect(inc).toHaveBeenCalledWith('work');
  });
});


