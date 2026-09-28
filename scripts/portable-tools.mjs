import { createRequire, registerHooks } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);

// Use the official WASM implementations so Windows Application Control does
// not need to load Rollup's native addon or start esbuild's native executable.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'esbuild') {
      return nextResolve(pathToFileURL(require.resolve('esbuild-wasm')).href, context);
    }
    if (specifier === 'rollup' || specifier.startsWith('rollup/')) {
      const portableSpecifier = specifier.replace(/^rollup/, '@rollup/wasm-node');
      return nextResolve(pathToFileURL(require.resolve(portableSpecifier)).href, context);
    }
    return nextResolve(specifier, context);
  },
});
