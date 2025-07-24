/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.config.js');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'resources/js'),
    },
    compress: true,
    hot: true,
    port: 3000,
    // error Cross-Origin Request Blocked
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
  },
  devtool: 'inline-source-map',
});
