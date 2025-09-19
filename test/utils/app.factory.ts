import { INestApplication } from '@nestjs/common';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

type Override = { token: any; useValue?: any; useClass?: any };

export async function createTestingApp(overrides: Override[] = []): Promise<INestApplication> {
  let builder: TestingModuleBuilder = Test.createTestingModule({ imports: [AppModule] });
  for (const o of overrides) {
    if (o.useValue !== undefined) builder = builder.overrideProvider(o.token).useValue(o.useValue);
    else if (o.useClass !== undefined) builder = builder.overrideProvider(o.token).useClass(o.useClass);
  }
  const moduleRef = await builder.compile();
  const app = moduleRef.createNestApplication();
  await app.init();
  return app;
}


