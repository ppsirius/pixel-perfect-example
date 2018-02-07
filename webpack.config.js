const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CopyPlugin = require('copy-webpack-plugin');


let config = {
  production: false,
  distPath: path.resolve(__dirname, './dist'),
  sourcePath: path.resolve(__dirname, './src'),
  assetsPath: path.resolve(__dirname, './src/assets'),
  sourceMaps: 'cheap-source-map',
  host: '0.0.0.0',
  port: '8888'
};
const plugins = [
  new ExtractTextPlugin('css/style.css'),
  new CopyPlugin([
    {
      from: config.sourcePath,
      ignore: ['js/**', 'scss/**']
    },
    {
      from: config.assetsPath,
      to: 'assets'
    }
  ])
];

if (process.env.NODE_ENV === 'production') {
  config = Object.assign({}, config, {
    production: true,
    distPath: config.distPath,
    sourceMaps: 'source-map'
  });
};

module.exports = {
  entry: {
    main: path.join(config.sourcePath, 'js/main.entry.js')
  },
  output: {
    path: config.distPath,
    filename: 'js/[name].bundle.js'
  },
  devtool: config.sourceMaps,
  devServer: {
    contentBase: config.distPath,
    host: config.host,
    port: config.port
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['env']]
            }
          }
        //   {
        //     loader: 'eslint-loader',
        //     options: {
        //       configFile: 'config/eslint.js'
        //     }
        //   }
        ]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract([
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer()],
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ])
      }
    ]
  },
  plugins
};
