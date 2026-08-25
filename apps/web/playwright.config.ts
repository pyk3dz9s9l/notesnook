import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "__e2e__",
  testMatch: ["**/geralt-leak*.spec.ts"],
  timeout: 60000,
  expect: {
    timeout: 20000
  },
  workers: 2,
  reporter: "list",
  retries: 0,
  fullyParallel: true,
  preserveOutput: "failures-only",
  outputDir: "test-results",
  use: {
    baseURL: "http://localhost:3000/",
    headless: true,
    acceptDownloads: true,
    browserName: "chromium",
    viewport: {
      width: 1280,
      height: 720
    }
  }
};

export default config;
