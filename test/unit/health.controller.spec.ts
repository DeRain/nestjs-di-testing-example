import { Test } from '@nestjs/testing';
import { HealthController } from '../../src/health/health.controller';
import { CACHE, DB, RPC } from '../../src/common/di/tokens';

describe('HealthController (unit)', () => {
	it('returns ok: true and all true pings', async () => {
		const moduleRef = await Test.createTestingModule({
			controllers: [HealthController],
			providers: [
				{ provide: DB, useValue: { ping: async () => true } },
				{ provide: CACHE, useValue: { ping: async () => true } },
				{ provide: RPC, useValue: { ping: async () => true } },
			],
		}).compile();
		const ctrl = moduleRef.get(HealthController);
		const res = await ctrl.get();
		expect(res).toEqual({ ok: true, db: true, cache: true, rpc: true });
	});
});
