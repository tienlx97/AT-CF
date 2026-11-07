import { pathToFileURL } from 'node:url';
import path from 'node:path';

const sourceRootUrl = pathToFileURL(
  `${path.resolve(import.meta.dirname, '../src')}${path.sep}`,
);

/**
 * Keep Node's test runner aligned with the `@/* -> ./src/*` mapping in
 * jsconfig.json. Next.js and TypeScript resolve that alias themselves; plain
 * Node ESM needs this narrow loader hook.
 */
export function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    return nextResolve(new URL(specifier.slice(2), sourceRootUrl).href, context);
  }

  return nextResolve(specifier, context);
}
