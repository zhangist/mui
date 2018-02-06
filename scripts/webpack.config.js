const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const config = {
  entry: {
    style: path.join(__dirname, '../src/style.ts'),
  },
  output: {
    path: path.join(__dirname, '../build'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  autoprefixer({ browsers: ['> 5%'] }),
                ],
              },
            },
            'less-loader',
          ],
        }),
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true,
    }),
  ]
}

const minConfig = Object.assign({}, config)
minConfig.entry = {
  'style.min': path.join(__dirname, '../src/style.ts'),
}
minConfig.module = {
  rules: [
    {
      test: /\.ts$/,
      loader: 'ts-loader',
    },
    {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          { loader: 'css-loader', options: { minimize: true } },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer({ browsers: ['> 5%'] }),
              ],
            },
          },
          'less-loader',
        ],
      }),
    },
  ]
}

module.exports = [config, minConfig];
