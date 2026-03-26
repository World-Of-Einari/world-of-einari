import { build, analyzeMetafile } from 'esbuild';

const analyze = process.argv.includes('--analyze');

const result = await build({
  entryPoints: ['src/lambda.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/lambda.js',
  format: 'cjs',
  external: ['@aws-sdk/*'],
  metafile: true,
});

const outputFile = result.metafile.outputs['dist/lambda.js'];
const sizeKb = (outputFile.bytes / 1024).toFixed(1);
console.log(`dist/lambda.js  ${sizeKb}kb`);

if (analyze) {
  const analysis = await analyzeMetafile(result.metafile);
  console.log(analysis);
}
