import { Controller, Get } from '@nestjs/common';
import { CACHE, DB, RPC } from '../common/di/tokens';
import { CachePort, DbPort, RpcPort } from '../common/di/types';
import { Inject } from '@nestjs/common';

@Controller('health')
export class HealthController {
	constructor(
		@Inject(DB) private readonly db: DbPort,
		@Inject(CACHE) private readonly cache: CachePort,
		@Inject(RPC) private readonly rpc: RpcPort,
	) {}

	@Get()
	async get() {
		const [dbOk, cacheOk, rpcOk] = await Promise.all([
			this.db.ping(),
			this.cache.ping(),
			this.rpc.ping(),
		]);
		return { ok: true, db: dbOk, cache: cacheOk, rpc: rpcOk };
	}
}
