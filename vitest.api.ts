import { resolve } from "pathe";
import Unimport from "unimport/unplugin";
import { defineConfig } from "vitest/config";
import { testImports } from "./imports";

export default defineConfig({
  plugins: [
    Unimport.vite({
      imports: [...testImports],
      dirs: ["./server/utils"],
      dts: true,
    }),
  ],
  test: {
    include: ["./test-api/*.test.ts"],
    globalSetup: "./global-setup.ts",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
});
