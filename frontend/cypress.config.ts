import { defineConfig } from "cypress";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "/.env") });

export default defineConfig({
  e2e: {
    env: {
      BACKEND_URL:
        process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api",
    },
    baseUrl: process.env.REACT_APP_BASE_URL || "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
