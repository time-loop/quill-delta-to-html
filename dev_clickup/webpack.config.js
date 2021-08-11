const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  let entry;
  entry = {
    'demo/demo.js': path.resolve(__dirname, '../demo/demo.js'),
  };

  return {
    entry,

    output: {
      filename: '[name]',
      path: path.resolve(__dirname, '../demo_dist/'),
    },

    resolve: {
      alias: {
        dist: path.resolve(__dirname, '../demo'),
      },
      extensions: ['.js', '.styl', '.html', '.ts'],
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
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
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
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        title: 'Quill delta to html demo',
        template: './demo/demo.html',
        filename: 'demo/demo.html',
      }),

      new webpack.HotModuleReplacementPlugin({}),
    ],

    devtool: 'eval-source-map',

    devServer: {
      host: 'localhost',
      contentBase: path.join(__dirname, '../demo_dist'),
      port: 8080,
      hot: false,
    },
  };
};
