import { Injectable, Scope } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable({ scope: Scope.REQUEST })
export class RequestIdProvider {
  private readonly id: string;

  constructor() {
    this.id = randomUUID();
  }

  getId(): string {
    return this.id;
  }
}


