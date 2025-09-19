import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { DB } from '../../src/common/di/tokens';
import { MockDb } from '../../src/common/testing/mock-db';
import { AccountsService } from '../../src/accounts/accounts.service';

describe('Integration: Real RPC+Redis, Mock DB', () => {
  let svc: AccountsService;
  let db: MockDb;
  let moduleRef: import('@nestjs/testing').TestingModule;

  beforeAll(async () => {
    db = new MockDb();
    moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(DB)
      .useValue(db)
      .compile();
    svc = moduleRef.get(AccountsService);
  });
  afterAll(async () => {
    await moduleRef.close();
  });


  it('uses real RPC and Redis, but DB writes are in-memory', async () => {
    const address = '0x0000000000000000000000000000000000000001';
    const wei = await svc.getBalance(address);
    expect(typeof wei).toBe('string');
    expect(db.rows.length).toBe(1);
  });
});


