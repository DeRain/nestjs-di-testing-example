import { CachePort } from '../di/types';

export class MockCache implements CachePort {
	private store = new Map<string, { value: string; expiresAt: number }>();

	async get(key: string): Promise<string | null> {
		const rec = this.store.get(key);
		if (!rec) return null;
		if (rec.expiresAt < Date.now()) {
			this.store.delete(key);
			return null;
		}
		return rec.value;
	}

	async set(key: string, val: string, ttlSec: number): Promise<void> {
		this.store.set(key, { value: val, expiresAt: Date.now() + ttlSec * 1000 });
	}

	async ping(): Promise<boolean> {
		return true;
	}
}
