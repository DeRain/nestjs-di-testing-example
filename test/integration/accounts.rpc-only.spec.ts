import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { AccountsService } from '../../src/accounts/accounts.service';
import { CACHE, DB, RPC } from '../../src/common/di/tokens';
import { MockCache } from '../../src/common/testing/mock-cache';
import { MockDb } from '../../src/common/testing/mock-db';
import { MockRpc } from '../../src/common/testing/mock-rpc';

describe('AccountsService (integration: RPC only)', () => {
	let svc: AccountsService;
	let db: MockDb;
	let cache: MockCache;

	beforeAll(async () => {
		db = new MockDb();
		cache = new MockCache();
		const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
			.overrideProvider(DB)
			.useValue(db)
			.overrideProvider(CACHE)
			.useValue(cache)
			.overrideProvider(RPC)
			.useValue(new MockRpc(1337, '12345'))
			.compile();
		svc = moduleRef.get(AccountsService);
	});

	it('fetches from RPC and writes audit on cache miss', async () => {
		const wei = await svc.getBalance('0x0000000000000000000000000000000000000002');
		expect(wei).toBe('12345');
		expect(db.rows.length).toBe(1);
		const cached = await cache.get('balance:0x0000000000000000000000000000000000000002');
		expect(cached).toBe('12345');
	});

	it('errors on invalid address', async () => {
		await expect(svc.getBalance('not-an-address')).rejects.toThrow();
	});
});
