import { Injectable } from '@nestjs/common';
import { GreetingPort } from '../../common/di/types';

@Injectable()
export class DefaultGreetingService implements GreetingPort {
  sayHello(name: string): string {
    return `Hello, ${name}!`;
  }
}

@Injectable()
export class ShoutingGreetingService implements GreetingPort {
  constructor(private readonly inner: DefaultGreetingService) {}

  sayHello(name: string): string {
    return this.inner.sayHello(name).toUpperCase();
  }
}


