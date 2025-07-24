const path = require('path');

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: '> 0.25%, not dead',
        useBuiltIns: 'usage',
        corejs: '3.36.1',
        bugfixes: true,
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        importSource: '@emotion/react',
      },
    ],
    [
      '@babel/preset-typescript',
      {
        tsconfig: path.resolve(__dirname, 'tsconfig.json'), // Adjust path if needed
      },
    ],
  ],
  plugins: [
    [
      '@emotion',
      {
        importMap: {
          // ... your importMap configuration
        },
      },
    ],
    [
      'babel-plugin-import',
      {
        libraryName: '@mui/material',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'core',
    ],
    [
      'babel-plugin-import',
      {
        libraryName: '@mui/icons-material',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'icons',
    ],
  ],
};
