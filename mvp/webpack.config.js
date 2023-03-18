/* eslint-disable no-undef */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// eslint-disable-next-line no-undef
module.exports = (env) => ({
  target: 'web',
  entry: './src/index.js',
  output: {
    publicPath: '/',
    filename: 'app.js',
    clean: true,
  },
  devServer: {
    historyApiFallback: true,
    static: {
      publicPath: '/',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      meta: {
        'http-equiv': 'X-UA-Compatiable',
        content: 'IE=edge',
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.svg$/i,
        use: 'svg-sprite-loader',
      },
      {
        test: /\.css$/i,
        use: [
          env.prod ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
  // Подключение Яндекс.Карт
  externalsType: 'script',
  externals: {
    ymaps: [
      'https://api-maps.yandex.ru/2.1/?apikey=ваш API-ключ&lang=ru_RU',
      'ymaps',
    ],
  },
});
