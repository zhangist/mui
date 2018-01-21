const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const config = {
  devtool: 'eval-source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    examples: [
      path.join(__dirname, '../examples/examples.tsx'),
      'webpack-dev-server/client',
    ],
    style: path.join(__dirname, '../src/style.ts'),
  },
  output: {
    path: path.join(__dirname, '../examples'),
    filename: '[name].js',
    chunkFilename: 'chunk.[name].js',
    publicPath: '/',
  },
  devServer: {
    contentBase: [
      path.join(__dirname, "../examples"),
      path.join(__dirname, "../src"),
    ],
    compress: true,
    port: 9000,
    hotOnly: true,
    stats: "errors-only",
  },
  module: {
    rules: [
      {
        test: /\.ts[x]?$/,
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
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'examples.html',
      template: path.join(__dirname, '../examples/index.html'),
    }),
  ]
}

module.exports = config;
