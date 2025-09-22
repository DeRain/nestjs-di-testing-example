import { Module } from '@nestjs/common';
import { CLOCK, NOW_FN } from '../../common/di/tokens';
import { ClockProviders, FixedClock } from './clock';

@Module({
  providers: [
    ...ClockProviders,
    { provide: CLOCK, useClass: FixedClock },
  ],
  exports: [CLOCK, NOW_FN],
})
export class ClockUsageModule {}


