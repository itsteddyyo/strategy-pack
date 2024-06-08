const path = require('path')
const { defineConfig } = require('vite')

import ViteYaml from '@modyfi/vite-plugin-yaml';

module.exports = defineConfig({
  plugins: [
    ViteYaml()
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'area-strategy',
      fileName: (format) => `area-strategy.${format}.js`
    }
  }
});
