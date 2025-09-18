import { Module, Global } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AccountsModule } from './accounts/accounts.module';
import { DB, CACHE, RPC } from './common/di/tokens';
import { PrismaService } from './infra/db/prisma.service';
import { RedisService } from './infra/cache/redis.service';
import { RpcService } from './infra/rpc/rpc.service';

@Global()
@Module({
  imports: [HealthModule, AccountsModule],
  providers: [
    { provide: DB, useClass: PrismaService },
    { provide: CACHE, useClass: RedisService },
    { provide: RPC, useClass: RpcService },
  ],
  exports: [DB, CACHE, RPC],
})
export class AppModule {}
