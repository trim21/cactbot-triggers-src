const fs = require('node:fs/promises');

const { globalExternals } = require('@fal-works/esbuild-plugin-global-externals');

const esbuild = require('esbuild');

async function main() {
  await fs.rm('./dist/', { recursive: true, force: true });

  await esbuild.build({
    entryPoints: ['./src/raidboss/index.ts'],
    format: 'esm',
    bundle: true,
    outfile: './dist/raidboss/raidboss.js',
    target: 'chrome103',
    charset: 'utf8',
    sourcemap: 'inline',
    plugins: [
      globalExternals(
        Object.fromEntries(
          Object.entries({
            'cactbot/resources/util': 'Util',
            'cactbot/resources/netregexes': 'NetRegexes',
            'cactbot/resources/conditions': 'Conditions',
            'cactbot/resources/zone_id': 'ZoneId',
          }).map(([key, value]) => [key, { varName: value, type: 'esm' }]),
        ),
      ),
    ],

    banner: '(async function main(){',
    footer: '}).catch(e=>{throw e});',
  });

  await fs.cp('./src/raidboss.css', './dist/raidboss/timeline.css');
}

main().catch((e) => {
  throw e;
});
