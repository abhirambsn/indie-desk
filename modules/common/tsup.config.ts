import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'], // support both ESModules and CommonJS
  dts: true, // generate .d.ts types
  sourcemap: true,
  clean: true, // clean dist folder before building
});
