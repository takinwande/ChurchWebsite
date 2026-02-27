const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

/** @type {import('jest').Config} */
const customConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^next/image$': '<rootDir>/__mocks__/next/image.tsx',
    '^next/link$': '<rootDir>/__mocks__/next/link.tsx',
    '^next/navigation$': '<rootDir>/__mocks__/next/navigation.ts',
    '^framer-motion$': '<rootDir>/__mocks__/framer-motion.tsx',
    '\\.css$': '<rootDir>/__mocks__/styleMock.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(lucide-react|@radix-ui|@portabletext\\/react|framer-motion)/)',
  ],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
  ],
  collectCoverageFrom: [
    'lib/utils.ts',
    'app/api/contact/route.ts',
    'components/**/*.tsx',
    '!components/ui/**',
    '!**/*.d.ts',
  ],
}

module.exports = createJestConfig(customConfig)
