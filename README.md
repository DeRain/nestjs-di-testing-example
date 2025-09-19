# NestJS DI + Testing Demo

A tiny NestJS API showcasing DI with tokens/interfaces, factory providers, and testing across unit, integration, and e2e. Uses Prisma (Postgres), ioredis, and ethers JsonRpcProvider.

## Quick start

```bash
npm i
# Spin infra (Postgres, Redis, Anvil)
npm run compose:up

# Create test/e2e env used by scripts and (optionally) dev
cat > .env.test.e2e << 'EOF'
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nest_demo?schema=public
REDIS_URL=redis://localhost:6379
RPC_URL=http://localhost:8545
EOF

# Prepare database and seed
dotenv -e .env.test.e2e -- npx prisma migrate deploy
dotenv -e .env.test.e2e -- npx prisma generate
npm run prisma:seed

# Start the API (loads your current shell env)
dotenv -e .env.test.e2e -- npm run dev
```

## Endpoints

- GET `/health` → `{ ok: true, db: boolean, cache: boolean, rpc: boolean }`
- GET `/accounts/:address/balance`
- POST `/accounts/refresh` `{ address }`

## Testing

```bash
npm run test:unit
npm run test:integration   # spins docker-compose (postgres, redis, anvil)
npm run test:e2e           # spins docker-compose (postgres, redis, anvil)
```

Notes:
- Integration and E2E use `.env.test.e2e` and run against compose services.
- Anvil is configured to bind `0.0.0.0` so the host can reach `http://localhost:8545`.

## DI tokens and overrides

```ts
import { Test } from '@nestjs/testing';
import { RPC } from './src/common/di/tokens';

const mockRpc = { getBalance: async () => '123', getChainId: async () => 1, ping: async () => true };

const moduleRef = await Test.createTestingModule({ /* ... */ })
  .overrideProvider(RPC)
  .useValue(mockRpc)
  .compile();
```

## Environment

- DATABASE_URL, REDIS_URL, RPC_URL, PORT. This repo uses `.env.test.e2e` for integration/e2e and can be reused for local dev:

```bash
cat > .env.test.e2e << 'EOF'
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nest_demo?schema=public
REDIS_URL=redis://localhost:6379
RPC_URL=http://localhost:8545
EOF
```

## DI & Testing Map

- Basic DI (useClass/useExisting/useValue): `src/examples/greeting/*`, tests in `test/unit/di.greeting.spec.ts`
- Factory provider: `src/examples/factory/cache-key-prefix.provider.ts`, tests in `test/unit/factory.cache-prefix.spec.ts`
- Async provider: `src/examples/async/rpc-client.module.ts`, tests in `test/unit/async.rpc-client.spec.ts`
- Dynamic module: `src/examples/dynamic/metrics.module.ts`, tests in `test/unit/dynamic.metrics.spec.ts`
- Scoped provider: `src/common/request-id/*` (REQUEST scope), e2e in `test/e2e/accounts.requestid-cache.e2e-spec.ts`
- Alias tokens: `src/examples/alias/clock.ts`, tests in `test/unit/alias.clock.spec.ts`
- ModuleRef optional: `src/examples/moduleref/optional.service.ts`, tests in `test/unit/moduleref.optional.spec.ts`

## Integration & E2E highlights

- Integration partial mocks:
  - Real DB+Redis, Mock RPC: `test/integration/accounts.db-cache.spec.ts`
  - Real RPC+DB, Mock Redis: `test/integration/rpc-db.mock-redis.spec.ts`
  - Real RPC+Redis, Mock DB: `test/integration/rpc-redis.mock-db.spec.ts`
- E2E selective overrides:
  - Health override cases: `test/e2e/health.overrides.e2e-spec.ts`
  - Accounts with RequestId and cache override: `test/e2e/accounts.requestid-cache.e2e-spec.ts`
  - Refresh with RPC mocked: `test/e2e/accounts.refresh-mocked.e2e-spec.ts`

## Docker compose (e2e)

Brings up Postgres, Redis, and Anvil. E2E loads `.env.test.e2e` automatically via scripts.
