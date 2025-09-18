# NestJS DI + Testing Demo

A tiny NestJS API showcasing DI with tokens/interfaces, factory providers, and testing across unit, integration, and e2e. Uses Prisma (Postgres), ioredis, and ethers JsonRpcProvider.

## Quick start

```bash
cp .env.example .env
npm i
npm run prisma:migrate
npm run dev
```

## Endpoints

- GET `/health` → `{ ok: true, db: boolean, cache: boolean, rpc: boolean }`
- GET `/accounts/:address/balance`
- POST `/accounts/refresh` `{ address }`

## Testing

```bash
npm run test:unit
npm run test:integration   # spins docker-compose (postgres, redis, anvil); no skips
npm run e2e                # spins docker-compose (postgres, redis, anvil)
```

Notes:
- Integration and E2E use `.env.test.e2e` and run against compose services.
- Anvil is configured to bind `0.0.0.0` so the host can reach `http://localhost:8545`.

## DI tokens and overrides

```ts
import { Test } from '@nestjs/testing';
import { RPC } from './src/common/di/tokens';

const mockRpc = { getBalance: async () => '123', getChainId: async () => 1, ping: async () => true };

const moduleRef = await Test.createTestingModule({ /* ... */ }).compile();
moduleRef.overrideProvider(RPC).useValue(mockRpc);
```

## Environment

- DATABASE_URL, REDIS_URL, RPC_URL, PORT. See `.env.example` and `.env.test.e2e`.

## Docker compose (e2e)

Brings up Postgres, Redis, and Anvil. E2E loads `.env.test.e2e` automatically via scripts.
