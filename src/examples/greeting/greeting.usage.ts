import { Module } from '@nestjs/common';
import { GREETING, GREETING_SHOUTING } from '../../common/di/tokens';
import { DefaultGreetingService, ShoutingGreetingService } from './greeting.service';

@Module({
  providers: [
    DefaultGreetingService,
    ShoutingGreetingService,
    { provide: GREETING, useClass: DefaultGreetingService },
    { provide: GREETING_SHOUTING, useExisting: ShoutingGreetingService },
    { provide: 'STATIC_GREETING', useValue: { sayHello: (n: string) => `Hi, ${n}.` } },
  ],
  exports: [GREETING, GREETING_SHOUTING, 'STATIC_GREETING'],
})
export class GreetingUsageModule {}


