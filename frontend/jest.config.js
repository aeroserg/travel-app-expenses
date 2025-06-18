// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["<rootDir>/src/__tests__/utils/"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  coverageDirectory: "coverage",
  coverageReporters: ["json-summary", "lcov", "text-summary"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.config.{ts,tsx}",
    "!src/app/**/*.tsx",
    "!src/hooks/**",
    "!src/api/**",
    "!src/store/**",
    "!src/components/shared/**",
    "!src/components/profile/**",
    
  ],
};

module.exports = createJestConfig(customJestConfig);
