import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

const publicConfig = {
  format: 'umd',
  name: 'kronoFlowPuzzle',
  sourcemap: true,
};

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        ...publicConfig,
      },
    ],
    plugins: [
      nodeResolve({ preferBuiltins: false }),
      commonjs(),
      typescript({
        declaration: false,
        target: "ES5",
      }),
      json(),
    ],
  },
];
