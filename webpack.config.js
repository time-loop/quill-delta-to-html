const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  let entry;
  entry = {
    'demo/main.js': path.resolve(__dirname, './demo/main.js'),
  };

  return {
    entry,

    output: {
      filename: '[name]',
      path: path.resolve(__dirname, '../dist_demo/'),
    },

    resolve: {
      alias: {
        dist: path.resolve(__dirname, '../dist_demo'),
        root: path.resolve(__dirname, '../'),
      },
      extensions: ['.js', '.ts', '.html'],
    },

    module: {
      rules: [
        {
          test: /\.(html|svg)$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                minimize: true,
              },
            },
          ],
        },

        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/env',
                  {
                    targets: {
                      browsers: [
                        'last 2 Chrome major versions',
                        'last 2 Firefox major versions',
                        'last 2 Safari major versions',
                        'last 2 Edge major versions',
                        'last 2 iOS major versions',
                        'last 2 ChromeAndroid major versions',
                      ],
                    },
                  },
                ],
              ],
            },
          },
        },

        {
          test: /\.ts$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'ts-loader'
          },
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        title: 'Quill Delta To Html Demo',
        template: './demo/demo-clickup-broswer.html',
        filename: 'demo/demo-clickup-broswer.html',
      }),

      new webpack.HotModuleReplacementPlugin({}),
    ],

    devtool: 'eval-source-map',

    devServer: {
      host: 'localhost',
      contentBase: path.join(__dirname, '../dist_demo'),
      port: 8080,
      hot: false,
    },
  };
};
