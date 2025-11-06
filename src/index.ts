import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

function hasPackage(name: string) {
  try {
    // Try to resolve from current working directory context
    const requireFn = typeof require !== 'undefined' ? require : createRequire(import.meta.url);
    const resolvedPath = requireFn.resolve(name, {
      paths: [path.resolve(process.cwd())],
    });
    return !!resolvedPath;
  } catch {
    return false;
  }
}

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const YAML_SENTINEL = '# Managed by cpconfig';
const JSON_SENTINEL = '"Managed by cpconfig"';
const JS_SENTINEL = '// Managed by cpconfig';

export function config() {
  return {
    '.commitlintrc.yaml': {
      contents: fs.readFileSync(path.resolve(__dirname, '../templates/.commitlintrc.yaml'), 'utf8'),
      sentinel: YAML_SENTINEL,
    },
    'eslint.config.mts': {
      contents: fs.readFileSync(path.resolve(__dirname, '../templates/eslint.config.mts'), 'utf8'),
      sentinel: JS_SENTINEL,
    },
    'tsconfig.json': {
      contents: fs.readFileSync(path.resolve(__dirname, '../templates/tsconfig.json'), 'utf8'),
      sentinel: JSON_SENTINEL,
    },
    'tsconfig.build.json': {
      contents: fs.readFileSync(
        path.resolve(__dirname, '../templates/tsconfig.build.json'),
        'utf8',
      ),
      sentinel: JSON_SENTINEL,
    },
    '.prettierrc.yaml': {
      contents: fs.readFileSync(path.resolve(__dirname, '../templates/.prettierrc.yaml'), 'utf8'),
      sentinel: YAML_SENTINEL,
    },
    'vitest.config.ts': {
      contents: fs.readFileSync(
        path.resolve(__dirname, '../templates/vitest.config.ts.template'),
        'utf8',
      ),
      sentinel: JS_SENTINEL,
    },
    ...(hasPackage('tsup')
      ? {
          'tsconfig.tsup.json': {
            contents: fs.readFileSync(
              path.resolve(__dirname, '../templates/tsconfig.tsup.json'),
              'utf8',
            ),
            sentinel: JSON_SENTINEL,
          },
        }
      : undefined),
  };
}
