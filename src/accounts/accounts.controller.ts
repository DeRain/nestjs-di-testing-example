import { Body, Controller, Get, Param, Post, BadRequestException } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { isAddress } from 'ethers';

class RefreshDto { address!: string }

@Controller('accounts')
export class AccountsController {
	constructor(private readonly svc: AccountsService) {}

	@Get(':address/balance')
	async getBalance(@Param('address') address: string) {
		if (!isAddress(address)) throw new BadRequestException('invalid address');
		const wei = await this.svc.getBalance(address);
		return { address, wei };
	}

	@Post('refresh')
	async refresh(@Body() body: RefreshDto) {
		if (!body?.address || !isAddress(body.address)) throw new BadRequestException('invalid address');
		const wei = await this.svc.refresh(body.address);
		return { address: body.address, wei };
	}
}
