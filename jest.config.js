const baseConfig = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
}

const browserConfig = {
    ...baseConfig,
    displayName: 'Browser Providers',
    testEnvironment: 'jsdom',
    testMatch: [
        '**/announce-provider.test.ts',
    ],
    setupFilesAfterEnv: ['./jest.setup.browser.js'],
};

module.exports = {
    ...baseConfig,
    projects: [browserConfig],
};
