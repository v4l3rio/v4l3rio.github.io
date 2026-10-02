import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  outputDir: ".qa/artifacts",
  reporter: [["list"], ["json", { outputFile: ".qa/results.json" }]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    launchOptions: process.platform === "darwin" ? { executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" } : {},
  },
  webServer: {
    command: "pnpm preview --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
  },
});
