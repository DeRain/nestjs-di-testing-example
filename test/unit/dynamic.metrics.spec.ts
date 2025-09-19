import { Test } from '@nestjs/testing';
import { METRICS } from '../../src/common/di/tokens';
import { MetricsModule, RealMetrics } from '../../src/examples/dynamic/metrics.module';

describe('[Dynamic Module] MetricsModule.register', () => {
  it('disabled: no-ops', async () => {
    const moduleRef = await Test.createTestingModule({ imports: [MetricsModule.register({ enabled: false })] }).compile();
    const metrics = moduleRef.get<any>(METRICS as any);
    expect(() => metrics.increment('x')).not.toThrow();
  });

  it('enabled: records values', async () => {
    const moduleRef = await Test.createTestingModule({ imports: [MetricsModule.register({ enabled: true })] }).compile();
    const metrics = moduleRef.get<RealMetrics>(METRICS as any);
    metrics.increment('hits');
    metrics.gauge('temp', 42);
    expect(metrics.getCounter('hits')).toBe(1);
    expect(metrics.getGauge('temp')).toBe(42);
  });
});


