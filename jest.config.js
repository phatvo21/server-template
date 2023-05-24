// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.spec.ts$',
  coverageThreshold: {
    global: {
      functions: 79,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '**/**/*.ts',
    '!**/node_modules/**',
    '!**/build/**',
    '!**/coverage/**',
    '!dist/**',
    '!jest.config.js',
    '!**/test/**',
    '!test/**',
  ],
  coverageReporters: ['text', 'text-summary'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/', '<rootDir>/test/'],
  moduleNameMapper: {
    '@app/user/(.*)': '<rootDir>/src/$1',
    '@app/user': '<rootDir>/src',
  },
  setupFilesAfterEnv: ['jest-extended', '<rootDir>/test/setup.testing.ts'],
};
