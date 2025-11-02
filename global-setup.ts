import { promises as fsp } from "node:fs";
import { tmpdir } from "node:os";
import { Listener, listen } from "listhen";
import { fileURLToPath } from "mlly";
import type { Nitro } from "nitropack";
import {
  build,
  copyPublicAssets,
  createNitro,
  prepare,
  prerender,
} from "nitropack";
import type { FetchOptions } from "ofetch";
import { $fetch } from "ofetch";
import { join, resolve } from "pathe";
import { joinURL } from "ufo";
import { adminId, regularId } from "./constants";

interface Context {
  preset: string;
  nitro?: Nitro;
  rootDir: string;
  outDir: string;
  fetch: (url: string, opts?: FetchOptions) => Promise<any>;
  server?: Listener;
  env: Record<string, string>;
}

const fixtureDir = fileURLToPath(new URL(".", import.meta.url).href);

const getPresetTmpDir = (preset: string) =>
  resolve(
    process.env.NITRO_TEST_TMP_DIR || join(tmpdir(), "nitro-tests"),
    preset,
  );
const preset = "node";

let teardownHappened = false;
const presetTmpDir = getPresetTmpDir(preset);

const ctx: Context = {
  preset,
  rootDir: fixtureDir,
  outDir: resolve(fixtureDir, presetTmpDir, ".output"),
  env: {
    SECRET: "gurievcreative",
    NITRO_SECRET: "gurievcreative",
    PORT: "3000",
    API_URL: "http://localhost:3000",
    NITRO_ROUTES_FILE: "./routes.json",
    VALID_ADMIN_ACCESS_TOKEN: "",
    VALID_REGULAR_ACCESS_TOKEN: "",
    VALID_ADMIN_ACCESS_TOKEN_WITH_REGULAR_ID: "",
  },
  fetch: (url, opts): Promise<Response> =>
    $fetch(joinURL(ctx.server!.url, url.slice(1)), {
      redirect: "manual",
      ignoreResponseError: true,
      ...(opts as any),
    }),
};

export const setup = async () => {
  await fsp.rm(presetTmpDir, { recursive: true }).catch(() => {
    // biome-ignore lint/suspicious/noConsole: on purpose
    console.log("log: no temp dir to remove");
  });
  await fsp.mkdir(presetTmpDir, { recursive: true });

  // Generate access tokens
  ctx.env.VALID_ADMIN_ACCESS_TOKEN = await issueAccessToken(
    { userId: adminId, role: "admin", id: adminId },
    { secret: "gurievcreative" },
  );
  ctx.env.VALID_REGULAR_ACCESS_TOKEN = await issueAccessToken(
    { userId: regularId, role: "user", id: regularId },
    { secret: "gurievcreative" },
  );
  ctx.env.VALID_ADMIN_ACCESS_TOKEN_WITH_REGULAR_ID = await issueAccessToken(
    { userId: regularId, role: "admin", id: adminId },
    { secret: "gurievcreative" },
  );

  // Set environment variables for process compatible presets
  for (const [name, value] of Object.entries(ctx.env)) {
    process.env[name] = value;
  }

  const nitro = (ctx.nitro = await createNitro({
    preset: ctx.preset,
    dev: false,
    rootDir: ctx.rootDir,
    runtimeConfig: {
      nitro: {
        envPrefix: "CUSTOM_",
      },
    },
    buildDir: resolve(fixtureDir, presetTmpDir, ".nitro"),
    serveStatic: true,
    output: {
      dir: ctx.outDir,
    },
    timing: true,
  }));

  await prepare(nitro);
  await copyPublicAssets(nitro);
  await prerender(nitro);
  await build(nitro);

  const entryPath = resolve(ctx.outDir, "server/index.mjs");
  const { listener } = await import(entryPath);
  ctx.server = await listen(listener);
  // biome-ignore lint/suspicious/noConsole: on purpose
  console.log(">", ctx.server!.url);
};

export const teardown = async () => {
  if (teardownHappened) {
    throw new Error("teardown called twice");
  }
  teardownHappened = true;

  if (ctx.server) {
    await ctx.server.close();
  }
  if (ctx.nitro) {
    await ctx.nitro.close();
  }
};

export default setup;
