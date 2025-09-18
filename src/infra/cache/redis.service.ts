import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { CachePort } from '../../common/di/types';

@Injectable()
export class RedisService implements CachePort {
	private client: Redis;

	constructor() {
		const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
		this.client = new Redis(url);
	}

	async get(key: string): Promise<string | null> {
		return this.client.get(key);
	}

	async set(key: string, val: string, ttlSec: number): Promise<void> {
		await this.client.set(key, val, 'EX', ttlSec);
	}

	async ping(): Promise<boolean> {
		try {
			const res = await this.client.ping();
			return res.toLowerCase() === 'pong';
		} catch {
			return false;
		}
	}

	async onModuleDestroy(): Promise<void> {
		try {
			await this.client.quit();
		} catch {
			// ignore
		}
	}
}
