export interface DbPort {
	insertQuery(input: { address: string; chainId: number; resultWei: string }): Promise<void>;
	ping(): Promise<boolean>;
}

export interface CachePort {
	get(key: string): Promise<string | null>;
	set(key: string, val: string, ttlSec: number): Promise<void>;
	ping(): Promise<boolean>;
}

export interface RpcPort {
	getBalance(address: string): Promise<string>;
	getChainId(): Promise<number>;
	ping(): Promise<boolean>;
}
