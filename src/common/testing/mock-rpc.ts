import { RpcPort } from '../di/types';
import { isAddress } from 'ethers';

export class MockRpc implements RpcPort {
	constructor(private readonly chainId: number = 31337, private readonly balanceWei: string = '1000000000000000000') {}

	async getBalance(address: string): Promise<string> {
		if (!isAddress(address)) throw new Error('invalid address');
		return this.balanceWei;
	}

	async getChainId(): Promise<number> {
		return this.chainId;
	}

	async ping(): Promise<boolean> {
		return true;
	}
}
