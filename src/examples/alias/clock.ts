import { Provider } from '@nestjs/common';
import { CLOCK, NOW_FN } from '../../common/di/tokens';
import { ClockPort } from '../../common/di/types';

export class SystemClock implements ClockPort {
  now(): Date {
    return new Date();
  }
}

export class FixedClock implements ClockPort {
  constructor(private readonly fixed: Date) {}
  now(): Date {
    return this.fixed;
  }
}

export const ClockProviders: Provider[] = [
  { provide: CLOCK, useClass: SystemClock },
  { provide: NOW_FN, useFactory: (clock: ClockPort) => clock.now.bind(clock), inject: [CLOCK] },
];


