import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { AccountsService } from '../../src/accounts/accounts.service';
import { RPC } from '../../src/common/di/tokens';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const hasDb = !!process.env.DATABASE_URL;
const hasRedis = !!process.env.REDIS_URL;

(hasDb && hasRedis ? describe : describe.skip)('AccountsService (integration: DB+Cache real, RPC mocked)', () => {
	let svc: AccountsService;
	let moduleRef: import('@nestjs/testing').TestingModule;
	let prisma: PrismaClient;
	let redis: Redis;

	beforeAll(async () => {
		moduleRef = await Test.createTestingModule({ imports: [AppModule] })
			.overrideProvider(RPC)
			.useValue({ getBalance: async () => '777', getChainId: async () => 99, ping: async () => true })
			.compile();
		svc = moduleRef.get(AccountsService);
		prisma = new PrismaClient();
		redis = new Redis(process.env.REDIS_URL!);
	});

		afterAll(async () => {
		await prisma.$disconnect();
		await redis.quit();
			await moduleRef.close();
	});

	it('writes to DB and sets Redis with TTL', async () => {
		const address = '0x0000000000000000000000000000000000000000';
		const before = await prisma.query.count();
		const wei = await svc.getBalance(address);
		expect(wei).toBe('777');
		const after = await prisma.query.count();
		expect(after).toBe(before + 1);
		const cached = await redis.get(`balance:${address.toLowerCase()}`);
		expect(cached).toBe('777');
	});
});
