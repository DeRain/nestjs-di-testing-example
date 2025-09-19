import { Test } from '@nestjs/testing';
import { GREETING, GREETING_SHOUTING } from '../../src/common/di/tokens';
import { DefaultGreetingService, ShoutingGreetingService } from '../../src/examples/greeting/greeting.service';

describe('[DI] useClass/useExisting Greeting', () => {
  it('substitutes implementations and uses useExisting for shouting version', async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DefaultGreetingService,
        ShoutingGreetingService,
        { provide: GREETING, useClass: DefaultGreetingService },
        { provide: GREETING_SHOUTING, useExisting: ShoutingGreetingService },
        { provide: 'STATIC_GREETING', useValue: { sayHello: (n: string) => `Hi, ${n}.` } },
      ],
    }).compile();

    const base = moduleRef.get<GreetingLike>(GREETING as any);
    const shouting = moduleRef.get<GreetingLike>(GREETING_SHOUTING as any);
    const staticG = moduleRef.get<GreetingLike>('STATIC_GREETING' as any);

    expect(base.sayHello('dev')).toBe('Hello, dev!');
    expect(shouting.sayHello('dev')).toBe('HELLO, DEV!');
    expect(staticG.sayHello('dev')).toBe('Hi, dev.');
  });
});

type GreetingLike = { sayHello(name: string): string };


