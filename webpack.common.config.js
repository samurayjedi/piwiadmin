const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// const dependOn = [];

module.exports = {
  entry: {
    app: {
      import: './resources/js/app.tsx',
      // dependOn,
    },
  },
  /* optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: 'all',
    },
    runtimeChunk: { name: 'runtime' }, // the same that runtimeChunk: 'single'
  }, */
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './public/js/'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts|mjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        oneOf: [
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader', 'postcss-loader'],
          },
          {
            test: /\.s[ac]ss$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2,
                },
              },
              'postcss-loader',
              'sass-loader',
            ],
          },
          {
            test: /\.(jpe?g|gif|png|bmp|webp)$/,
            type: 'asset/resource',
          },
          {
            test: /\.svg$/,
            use: ['@svgr/webpack'],
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, './resources/js/'),
    },
  },
  plugins: [new HtmlWebpackPlugin(), new CleanWebpackPlugin()],
};
