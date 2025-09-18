import { Injectable } from '@nestjs/common';
import { JsonRpcProvider, isAddress } from 'ethers';
import { RpcPort } from '../../common/di/types';

@Injectable()
export class RpcService implements RpcPort {
	private provider: JsonRpcProvider;

	constructor() {
		const url = process.env.RPC_URL ?? 'http://localhost:8545';
		this.provider = new JsonRpcProvider(url);
	}

	async getBalance(address: string): Promise<string> {
		if (!isAddress(address)) {
			throw new Error('invalid address');
		}
		const bal = await this.provider.getBalance(address);
		return bal.toString();
	}

	async getChainId(): Promise<number> {
		const net = await this.provider.getNetwork();
		return Number(net.chainId.toString());
	}

	async ping(): Promise<boolean> {
		try {
			await this.provider.getBlockNumber();
			return true;
		} catch {
			return false;
		}
	}
}
