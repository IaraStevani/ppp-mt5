import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'test/web/**/*.cy.js',
    supportFile: 'test/web/support/e2e.js',
    video: false,
    screenshotOnRunFailure: true,
  },
});
