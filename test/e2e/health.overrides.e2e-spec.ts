import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CACHE, DB, RPC } from '../../src/common/di/tokens';

describe('E2E Health Overrides', () => {
  let app: INestApplication;

  afterEach(async () => {
    if (app) await app.close();
  });

  it('rpc failure via override', async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(RPC)
      .useValue({ ping: async () => false })
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
    const res = await request(app.getHttpServer()).get('/health').expect(200);
    expect(res.body.rpc).toBe(false);
    expect(res.body.ok).toBe(false);
  });

  it('db failure via override', async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(DB)
      .useValue({ ping: async () => false })
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
    const res = await request(app.getHttpServer()).get('/health').expect(200);
    expect(res.body.db).toBe(false);
    expect(res.body.ok).toBe(false);
  });

  it('cache failure via override', async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(CACHE)
      .useValue({ ping: async () => false })
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
    const res = await request(app.getHttpServer()).get('/health').expect(200);
    expect(res.body.cache).toBe(false);
    expect(res.body.ok).toBe(false);
  });
});


