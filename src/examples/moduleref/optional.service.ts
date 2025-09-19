import { Injectable, Optional } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { METRICS } from '../../common/di/tokens';
import { MetricsPort } from '../../common/di/types';

@Injectable()
export class OptionalMetricsUserService {
  private metrics?: MetricsPort;

  constructor(private readonly moduleRef: ModuleRef, @Optional() metrics?: MetricsPort) {
    this.metrics = metrics;
    if (!this.metrics) {
      try {
        this.metrics = this.moduleRef.get<MetricsPort>(METRICS as any, { strict: false } as any);
      } catch {
        this.metrics = undefined;
      }
    }
  }

  doWork(): string {
    this.metrics?.increment('work');
    return 'done';
  }
}


