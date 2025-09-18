import { Test } from '@nestjs/testing';
import { AccountsService } from '../../src/accounts/accounts.service';
import { CACHE, DB, RPC } from '../../src/common/di/tokens';
import { MockCache } from '../../src/common/testing/mock-cache';

describe('AccountsService (unit)', () => {
	let service: AccountsService;
	let cache: MockCache;
	const mockDb = { insertQuery: jest.fn(async () => {}), ping: jest.fn(async () => true) };
	const mockRpc = {
		getBalance: jest.fn(async () => '42'),
		getChainId: jest.fn(async () => 31337),
		ping: jest.fn(async () => true),
	};

	beforeEach(async () => {
		cache = new MockCache();
		const moduleRef = await Test.createTestingModule({
			providers: [AccountsService, { provide: CACHE, useValue: cache }, { provide: DB, useValue: mockDb }, { provide: RPC, useValue: mockRpc }],
		}).compile();
		service = moduleRef.get(AccountsService);
		jest.clearAllMocks();
	});

	it('returns cached balance and does not call RPC or DB on hit', async () => {
		await cache.set('balance:0x0000000000000000000000000000000000000000', '100', 10);
		const wei = await service.getBalance('0x0000000000000000000000000000000000000000');
		expect(wei).toBe('100');
		expect(mockRpc.getBalance).not.toHaveBeenCalled();
		expect(mockDb.insertQuery).not.toHaveBeenCalled();
	});

	it('calls RPC, writes DB, sets cache on miss', async () => {
		const wei = await service.getBalance('0x0000000000000000000000000000000000000001');
		expect(wei).toBe('42');
		expect(mockRpc.getBalance).toHaveBeenCalledTimes(1);
		expect(mockDb.insertQuery).toHaveBeenCalledTimes(1);
		const cached = await cache.get('balance:0x0000000000000000000000000000000000000001');
		expect(cached).toBe('42');
	});
});
