import type { Config } from 'jest';
import '@testing-library/jest-dom';

import { Request, Response } from 'node-fetch';

(global as any).Request = Request;
(global as any).Response = Response;

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
