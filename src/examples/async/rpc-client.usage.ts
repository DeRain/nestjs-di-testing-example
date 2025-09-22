import { Module } from '@nestjs/common';
import { RPC_CLIENT } from '../../common/di/tokens';
import { RpcClientModule } from './rpc-client.module';

@Module({
  imports: [RpcClientModule.register('http://localhost:8545')],
  exports: [RPC_CLIENT],
})
export class RpcClientUsageModule {}


