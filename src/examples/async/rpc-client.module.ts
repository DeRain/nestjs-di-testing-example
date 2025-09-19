import { DynamicModule, Module, Provider } from '@nestjs/common';
import { JsonRpcProvider } from 'ethers';
import { RPC_CLIENT } from '../../common/di/tokens';

export type RpcClient = JsonRpcProvider;

@Module({})
export class RpcClientModule {
  static register(url?: string): DynamicModule {
    const provider: Provider = {
      provide: RPC_CLIENT,
      useFactory: async () => {
        const rpcUrl = url || process.env.RPC_URL || 'http://localhost:8545';
        const client = new JsonRpcProvider(rpcUrl);
        await client.getBlockNumber();
        return client;
      },
    };
    return { module: RpcClientModule, providers: [provider], exports: [RPC_CLIENT] };
  }
}


