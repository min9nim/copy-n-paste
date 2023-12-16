/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  setupFiles: ['<rootDir>/testcase/setup-tests.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['testcase'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    /* do not works; */
    '/^@/*/': ['<rootDir>/src/*'],
  },
  coverageThreshold: {
    global: {
      branches: 3,
      functions: 3,
      lines: 3,
      statements: 3,
    },
  },
}
