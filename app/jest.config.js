/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  coverageProvider: 'v8',
  moduleNameMapper: {
    '^@jnscas/app/public/(.*)$': '<rootDir>/public/$1',
    '^@jnscas/app/src/(.*)$': '<rootDir>/src/$1',
    '^@jnscas/app/test/(.*)$': '<rootDir>/test/$1',
  },
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['/node_modules/'],
};

module.exports = config;
