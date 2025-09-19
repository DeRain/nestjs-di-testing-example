import { Module, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HealthModule } from './health/health.module';
import { AccountsModule } from './accounts/accounts.module';
import { DB, CACHE, RPC } from './common/di/tokens';
import { PrismaService } from './infra/db/prisma.service';
import { RedisService } from './infra/cache/redis.service';
import { RpcService } from './infra/rpc/rpc.service';
import { RequestIdProvider } from './common/request-id/request-id.provider';
import { RequestIdInterceptor } from './common/request-id/request-id.interceptor';

@Global()
@Module({
  imports: [HealthModule, AccountsModule],
  providers: [
    { provide: DB, useClass: PrismaService },
    { provide: CACHE, useClass: RedisService },
    { provide: RPC, useClass: RpcService },
    RequestIdProvider,
    { provide: APP_INTERCEPTOR, useClass: RequestIdInterceptor },
  ],
  exports: [DB, CACHE, RPC],
})
export class AppModule {}
