module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    transform: {
      '^.+\\.(ts|tsx)$': 'babel-jest',
    },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
    testPathIgnorePatterns: [
      '<rootDir>/.next/',
      '<rootDir>/node_modules/'
    ]
  };
  