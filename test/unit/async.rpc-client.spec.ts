import { Test } from '@nestjs/testing';
import { RpcClientModule } from '../../src/examples/async/rpc-client.module';
import { RPC_CLIENT } from '../../src/common/di/tokens';
import * as ethers from 'ethers';

describe('[Async Provider] RpcClientModule', () => {
  it('boot succeeds when ping works (mocked)', async () => {
    const originalEnv = process.env.RPC_URL;
    process.env.RPC_URL = 'http://localhost:8545';
    const moduleRef = await Test.createTestingModule({ imports: [RpcClientModule.register('http://example.com')] })
      .overrideProvider(RPC_CLIENT)
      .useFactory({
        factory: async () => ({ getBlockNumber: async () => 1 }),
      } as any)
      .compile();
    const client = moduleRef.get<any>(RPC_CLIENT as any);
    await expect(client.getBlockNumber()).resolves.toBe(1);
    process.env.RPC_URL = originalEnv;
  });

  it('boot fails when ping fails', async () => {
    const spy = jest.spyOn(ethers, 'JsonRpcProvider').mockImplementation((): any => ({
      getBlockNumber: async () => {
        throw new Error('boom');
      },
    }));
    await expect(Test.createTestingModule({ imports: [RpcClientModule.register('http://example.com')] }).compile()).rejects.toThrow();
    spy.mockRestore();
  });
});


