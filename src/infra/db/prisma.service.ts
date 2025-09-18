import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DbPort } from '../../common/di/types';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, DbPort {
	async onModuleInit(): Promise<void> {
		await this.$connect();
	}

	async enableShutdownHooks(app: INestApplication): Promise<void> {
		(this as any).$on('beforeExit', async () => {
			await app.close();
		});
	}

	async onModuleDestroy(): Promise<void> {
		await this.$disconnect();
	}

	async insertQuery(input: { address: string; chainId: number; resultWei: string }): Promise<void> {
		await this.query.create({ data: { address: input.address, chainId: input.chainId, resultWei: input.resultWei } });
	}

	async ping(): Promise<boolean> {
		try {
			await this.$queryRawUnsafe('SELECT 1');
			return true;
		} catch {
			return false;
		}
	}
}
