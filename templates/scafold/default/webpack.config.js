const UI_ENV_VARS = require('./environment.build')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve } = require('path')
// const NODE_MODULES_PATH = resolve(__dirname, './node_modules')
// const package = require('./package.json');

function transformContent(content) {
  const contentStr = content.toString('utf8')
    .replace('9000', process.env.UI_APP_PORT)
  return Buffer.from(contentStr)
}

module.exports = {
  devServer: {
    contentBase: resolve(__dirname, 'dist'),
    historyApiFallback: {
      rewrites: [
        { from: /.*\.html?/, to: '/' },
        { from: /^[\w/]+$/, to: '/' },
      ],
      verbose: true
    },
    host: '0.0.0.0',
    open: false,
    port: process.env.UI_APP_PORT,
  },
  entry: {
    index: './src/main.js',
    // vendor: Object.keys(package.dependencies)
  },
  externals: {
    environment: JSON.stringify(UI_ENV_VARS)
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dist')
  },
  plugins: [
    new Dotenv({path: resolve(__dirname, '.', '.env')}),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      chunks: ['vendor', 'index'],
      filename: './index.html',
      hash: true,
      template: './src/index.html',
    }),
    new CopyWebpackPlugin([
      { from: './assets', ignore: ['*.js'], to: 'assets' },
      { from: './src/*.css', to: 'css/[name].[ext]' },
      { from: 'serve.template.js', to: 'serve.js', transform: transformContent },
      { from: 'package.template.json', to: 'package.json', transform: transformContent },
      { from: 'LICENSE', to: 'LICENSE' },
      { from: './locales', ignore: ['*.js'], to: 'locales' },
    ])
  ],
  resolve: { extensions: ['.js'] },
  watch: false
}
