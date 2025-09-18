import { DbPort } from '../di/types';

export type QueryRow = { id: string; address: string; chainId: number; resultWei: string; queriedAt: Date };

export class MockDb implements DbPort {
	public rows: QueryRow[] = [];

	async insertQuery(input: { address: string; chainId: number; resultWei: string }): Promise<void> {
		this.rows.push({ id: `${this.rows.length + 1}`, address: input.address, chainId: input.chainId, resultWei: input.resultWei, queriedAt: new Date() });
	}

	async ping(): Promise<boolean> {
		return true;
	}
}
