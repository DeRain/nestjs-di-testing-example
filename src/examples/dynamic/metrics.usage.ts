import { Module } from '@nestjs/common';
import { METRICS } from '../../common/di/tokens';
import { MetricsModule } from './metrics.module';

@Module({
  imports: [MetricsModule.register({ enabled: true })],
  exports: [METRICS],
})
export class MetricsUsageModule {}


