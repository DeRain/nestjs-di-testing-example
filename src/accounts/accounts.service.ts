import { Inject, Injectable } from '@nestjs/common';
import { CACHE, DB, RPC } from '../common/di/tokens';
import { CachePort, DbPort, RpcPort } from '../common/di/types';

@Injectable()
export class AccountsService {
	constructor(
		@Inject(CACHE) private readonly cache: CachePort,
		@Inject(DB) private readonly db: DbPort,
		@Inject(RPC) private readonly rpc: RpcPort,
	) {}

	private cacheKey(address: string): string {
		return `balance:${address.toLowerCase()}`;
	}

	async getBalance(address: string): Promise<string> {
		const key = this.cacheKey(address);
		const cached = await this.cache.get(key);
		if (cached) return cached;
		const balance = await this.rpc.getBalance(address);
		const chainId = await this.rpc.getChainId();
		await this.db.insertQuery({ address, chainId, resultWei: balance });
		await this.cache.set(key, balance, 10);
		return balance;
	}

	async refresh(address: string): Promise<string> {
		const balance = await this.rpc.getBalance(address);
		const chainId = await this.rpc.getChainId();
		await this.db.insertQuery({ address, chainId, resultWei: balance });
		await this.cache.set(this.cacheKey(address), balance, 10);
		return balance;
	}
}
