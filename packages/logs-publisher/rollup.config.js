import typescript from 'rollup-plugin-typescript2';

module.exports = {
  input: './src/main.ts',
  output: {
    file: './dist/worker.mjs',
    format: 'es'
  },
  plugins: [typescript()]
};
