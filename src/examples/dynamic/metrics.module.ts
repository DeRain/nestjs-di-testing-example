import { DynamicModule, Module, Provider } from '@nestjs/common';
import { METRICS } from '../../common/di/tokens';
import { MetricsPort } from '../../common/di/types';

class RealMetrics implements MetricsPort {
  private counters = new Map<string, number>();
  private gauges = new Map<string, number>();

  increment(metricName: string, value: number = 1): void {
    const curr = this.counters.get(metricName) || 0;
    this.counters.set(metricName, curr + value);
  }
  gauge(metricName: string, value: number): void {
    this.gauges.set(metricName, value);
  }

  getCounter(metricName: string): number {
    return this.counters.get(metricName) || 0;
  }
  getGauge(metricName: string): number | undefined {
    return this.gauges.get(metricName);
  }
}

const NoopMetrics: MetricsPort = {
  increment: () => {},
  gauge: () => {},
};

@Module({})
export class MetricsModule {
  static register(options: { enabled: boolean }): DynamicModule {
    const provider: Provider = options.enabled
      ? { provide: METRICS, useClass: RealMetrics }
      : { provide: METRICS, useValue: NoopMetrics };
    return { module: MetricsModule, providers: [provider], exports: [METRICS] };
  }
}

export { RealMetrics };


