import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { CACHE } from '../../src/common/di/tokens';
import { MockCache } from '../../src/common/testing/mock-cache';
import { AccountsService } from '../../src/accounts/accounts.service';
import { PrismaClient } from '@prisma/client';

const hasDb = !!process.env.DATABASE_URL;

(hasDb ? describe : describe.skip)('Integration: Real RPC+DB, Mock Redis', () => {
  let svc: AccountsService;
  let prisma: PrismaClient;
  let moduleRef: import('@nestjs/testing').TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(CACHE)
      .useValue(new MockCache())
      .compile();
    svc = moduleRef.get(AccountsService);
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await moduleRef.close();
  });

  it('fetches from RPC and writes DB; cache is in-memory', async () => {
    const address = '0x0000000000000000000000000000000000000000';
    const before = await prisma.query.count();
    const wei = await svc.getBalance(address);
    expect(typeof wei).toBe('string');
    const after = await prisma.query.count();
    expect(after).toBe(before + 1);
  });
});


