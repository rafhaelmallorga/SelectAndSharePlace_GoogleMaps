const dotenv = require('dotenv');
const { DefinePlugin, EnvironmentPlugin } = require('webpack');
const path = require('path');

module.exports = env => ({
  mode: 'development',
  entry: './src/app.ts',
  devServer: {
    static: [
      {
        directory: path.join(__dirname),
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new EnvironmentPlugin({ ...process.env }),
    new DefinePlugin(
        {'process.env': JSON.stringify(dotenv.config().parsed)}
    )
  ]
});