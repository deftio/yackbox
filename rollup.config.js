import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
//import { terser } from '@rollup/plugin-terser'; // Import the terser plugin
import terser from '@rollup/plugin-terser'

const extensions = ['.js', '.jsx'];

// Rollup configuration for the yackbox project
export default [
  // UMD Configurations
  {
    input: 'src/yackbox.js',
    output: [
      {
        file: 'dist/yackbox.umd.js', // Unminified UMD build
        format: 'umd',
        name: 'yackbox',
        sourcemap: true,
      },
      {
        file: 'dist/yackbox.umd.min.js', // Minified UMD build
        format: 'umd',
        name: 'yackbox',
        sourcemap: true,
        plugins: [terser()], // Apply terser only to this output
      }
    ],
    plugins: [
      resolve({ extensions }),
      commonjs(),
      babel({
        extensions,
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env']
      })
    ]
  },
  // CJS Configurations
  {
    input: 'src/yackbox.js',
    output: [
      {
        file: 'dist/yackbox.cjs.js', // Unminified CJS build
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/yackbox.cjs.min.js', // Minified CJS build
        format: 'cjs',
        sourcemap: true,
        plugins: [terser()], // Apply terser only to this output
      }
    ],
    plugins: [
      resolve({ extensions }),
      commonjs(),
      babel({
        extensions,
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env']
      })
    ]
  },
  // ESM Configurations
  {
    input: 'src/yackbox.js',
    output: [
      {
        file: 'dist/yackbox.esm.js', // Unminified ESM build
        format: 'es',
        sourcemap: true,
      },
      {
        file: 'dist/yackbox.esm.min.js', // Minified ESM build
        format: 'es',
        sourcemap: true,
        plugins: [terser()], // Apply terser only to this output
      }
    ],
    plugins: [
      resolve({ extensions }),
      commonjs(),
      babel({
        extensions,
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env']
      })
    ]
  }
];
