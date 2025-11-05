import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(({ mode }) => {
  const isTest = process.env.VITEST === 'true' || mode === 'test';
  return {
    plugins: [react(), ...(isTest ? [] : [cloudflare()])],
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./vitest.setup.ts",
    },
  };
});
