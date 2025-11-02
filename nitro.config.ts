import { defineNitroConfig } from "nitropack/config";
import { baseImports } from "./imports";

// https://nitro.build/config
export default defineNitroConfig({
  compatibilityDate: "latest",
  errorHandler: "~/error",
  srcDir: "server",
  runtimeConfig: {
    secret: "secret",
    routesFile: "./routes.ts",
  },
  routeRules: {
    "/**": {
      cors: true,
      headers: {
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    },
  },
  imports: {
    dts: true,
    imports: [...baseImports],
    presets: [
      {
        from: "zod",
        imports: ["z"],
      },
    ],
    dirs: ["./server/composables"],
  },
});
