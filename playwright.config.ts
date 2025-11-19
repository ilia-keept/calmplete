import { defineConfig } from "@playwright/test";
import { configuration } from "./src/config/configuration";

export default defineConfig({
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "reports/playwright" }],
  ],
  projects: [
    {
      name: "api",
      testDir: "./tests/api",
      use: {
        ignoreHTTPSErrors: true,
        baseURL: configuration.apiBaseUrl,
        extraHTTPHeaders: {
          "Content-Type": "application/json",
        },
      },
    },
    {
      name: "e2e",
      testDir: "./tests/e2e",
      use: {
        ignoreHTTPSErrors: true,
      },
    },
  ],
});
