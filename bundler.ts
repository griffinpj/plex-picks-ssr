/* https://stackoverflow.com/questions/76028937/deno-bundle-replacement */

import * as esbuild from "https://deno.land/x/esbuild@v0.20.1/mod.js";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@0.9";

esbuild.build({
  plugins: [...denoPlugins()],
  entryPoints: [`${Deno.cwd()}/src/bundle/entry.js`],
  outdir: `${Deno.cwd()}/public/js/`,
  bundle: true,
  platform: "browser",
  format: "esm",
  target: "esnext",
  minify: true,
  sourcemap: true,
  treeShaking: true,
});

await esbuild.stop();
