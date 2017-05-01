const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/*global __dirname*/
module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader?importLoaders=1!postcss-loader',
        }),
      },
      {
        test: /\.(png|jpg|jpeg|svg|gif)$/,
        use: 'file-loader?name=/images/[hash].[ext]',
      },
    ]
  },
  devServer: {
    historyApiFallback: true,
    contentBase: [path.resolve(__dirname, 'dist')],
    port: 8080
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'head',
      hash: true,
      filename: 'index.html',
      template: './public/index.ejs'
    }),
    new ExtractTextPlugin('index.css'),
  ]
};
