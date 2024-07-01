import typescript from '@rollup/plugin-typescript';
import define from 'rollup-plugin-define';
import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import  terser  from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';

const path = require('path');
const pkg = require('./package.json');
const ENV_PROD = process.env.BUILD === 'production';

const output = () => {
  const pkg = require(path.join(__dirname, `package.json`));

  return [
    {
      file: `dist/index.umd.js`,
      format: 'umd',
      name: 'easepick',
      sourcemap: false,
      extend: true,
      globals(id) {
        if (/^@easepick\//.test(id)) {
          return 'easepick';
        }

        return id;
      }
    },
    {
      file: `dist/index.esm.js`,
      format: 'esm',
      sourcemap: false,
      extend: true,
    },
  ];
}

const getPackageConfig = (name) => {
  return {
    input: `src/index.ts`,
    output: output(name),
    plugins: [
      define({
        replacements: {
          __VERSION__: JSON.stringify(pkg.version),
        }
      }),
      resolve({
        resolveOnly: [/^@easepick\/.*$/]
      }),
      typescript({
        tsconfig: `tsconfig.json`,
        outputToFilesystem: false,
      }),
      postcss({
        extract: 'index.css',
        plugins: [autoprefixer],
        minimize: ENV_PROD,
      }),
      ENV_PROD && terser(),
      !ENV_PROD && serve({
          open: true,
          contentBase: ['./dist'],
          host: 'localhost',
          port: 3000,
      }),
    ],
    external(id) {
      return /^@easepick\//.test(id);
    }
  };
}

export default [
  getPackageConfig(),
]
