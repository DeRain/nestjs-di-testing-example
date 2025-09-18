import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaClient } from '@prisma/client';
import { CACHE } from '../../src/common/di/tokens';
import { MockCache } from '../../src/common/testing/mock-cache';
import Redis from 'ioredis';

async function waitForHealth(app: INestApplication, timeoutMs = 30000): Promise<void> {
	const start = Date.now();
	while (Date.now() - start < timeoutMs) {
		try {
			const res = await request(app.getHttpServer()).get('/health');
			if (res.status === 200 && res.body?.db && res.body?.cache && res.body?.rpc) return;
		} catch {}
		await new Promise((r) => setTimeout(r, 1000));
	}
	throw new Error('Services not healthy in time');
}

describe('App E2E', () => {
	let app: INestApplication;
	let prisma: PrismaClient;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
		app = moduleRef.createNestApplication();
		await app.init();
		prisma = new PrismaClient();
		await waitForHealth(app, 60000);
	});

	afterAll(async () => {
		await app.close();
		await prisma.$disconnect();
	});

	it('GET /health returns all true', async () => {
		const res = await request(app.getHttpServer()).get('/health').expect(200);
		expect(res.body).toEqual({ ok: true, db: true, cache: true, rpc: true });
	});

	it('GET /accounts/:address/balance persists an audit row', async () => {
		const address = '0x0000000000000000000000000000000000000000';
		const before = await prisma.query.count();
		const res = await request(app.getHttpServer()).get(`/accounts/${address}/balance`).expect(200);
		expect(res.body).toHaveProperty('wei');
		const after = await prisma.query.count();
		expect(after).toBe(before + 1);
	});

	it('POST /accounts/refresh overwrites cache and inserts audit', async () => {
		const address = '0x0000000000000000000000000000000000000000';
		const before = await prisma.query.count();
		await request(app.getHttpServer()).post('/accounts/refresh').send({ address }).expect(201);
		const after = await prisma.query.count();
		expect(after).toBe(before + 1);
	});

	it('partial mock: override CACHE in e2e and assert Redis untouched', async () => {
		const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
			.overrideProvider(CACHE)
			.useValue(new MockCache())
			.compile();
		const app2 = moduleRef.createNestApplication();
		await app2.init();
		await waitForHealth(app2, 60000);

		const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
		const beforeKeys = await redis.dbsize();
		await request(app2.getHttpServer()).get('/accounts/0x0000000000000000000000000000000000000000/balance').expect(200);
		const afterKeys = await redis.dbsize();
		expect(afterKeys).toBe(beforeKeys);
		await redis.quit();
		await app2.close();
	});
});
