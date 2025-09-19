import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaClient } from '@prisma/client';
import { RPC } from '../../src/common/di/tokens';

describe('E2E Refresh with RPC mocked', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(RPC)
      .useValue({ getBalance: async () => '999', getChainId: async () => 123, ping: async () => true })
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('updates DB with mocked value', async () => {
    const address = '0x0000000000000000000000000000000000000000';
    const before = await prisma.query.count();
    const res = await request(app.getHttpServer()).post('/accounts/refresh').send({ address }).expect(201);
    expect(res.body.wei).toBe('999');
    const after = await prisma.query.count();
    expect(after).toBe(before + 1);
  });
});


