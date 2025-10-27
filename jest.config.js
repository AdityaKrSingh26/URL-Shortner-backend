export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  collectCoverageFrom: [
    'controller/**/*.js',
    'models/**/*.js',
    'routes/**/*.js',
    'app.js',
    'index.js',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/tests/'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.simple.js'],
  testTimeout: 30000,
  globals: {
    'jest': true
  }
};
