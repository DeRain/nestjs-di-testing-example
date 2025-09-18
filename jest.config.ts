import type { Config } from 'jest';

const config: Config = {
  roots: ['<rootDir>'],
  projects: [
    {
      displayName: 'unit',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/test/unit/**/*.spec.ts'],
      moduleFileExtensions: ['ts', 'js', 'json'],
      globals: {
        'ts-jest': { tsconfig: '<rootDir>/tsconfig.json' },
      },
    },
    {
      displayName: 'integration',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/test/integration/**/*.spec.ts'],
      moduleFileExtensions: ['ts', 'js', 'json'],
      globals: {
        'ts-jest': { tsconfig: '<rootDir>/tsconfig.json' },
      },
    },
    {
      displayName: 'e2e',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/test/e2e/**/*.e2e-spec.ts'],
      moduleFileExtensions: ['ts', 'js', 'json'],
      globals: {
        'ts-jest': { tsconfig: '<rootDir>/tsconfig.json' },
      },
      setupFilesAfterEnv: ['<rootDir>/test/e2e/setup-e2e.ts'],
    },
  ],
};

export default config;
