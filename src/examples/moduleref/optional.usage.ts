import { Module } from '@nestjs/common';
import { METRICS } from '../../common/di/tokens';
import { OptionalMetricsUserService } from './optional.service';

@Module({
  providers: [OptionalMetricsUserService, { provide: METRICS, useValue: undefined }],
  exports: [OptionalMetricsUserService],
})
export class OptionalModuleRefUsageModule {}


