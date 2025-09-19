import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CACHE } from '../../src/common/di/tokens';
import { MockCache } from '../../src/common/testing/mock-cache';

describe('E2E Accounts with RequestId and cache override', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(CACHE)
      .useValue(new MockCache())
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns x-request-id header and deterministic cache behavior', async () => {
    const address = '0x0000000000000000000000000000000000000000';
    const r1 = await request(app.getHttpServer()).get(`/accounts/${address}/balance`).expect(200);
    expect(r1.headers['x-request-id']).toBeTruthy();
    const wei1 = r1.body.wei;
    const r2 = await request(app.getHttpServer()).get(`/accounts/${address}/balance`).expect(200);
    expect(r2.body.wei).toBe(wei1); // cached
  });
});


