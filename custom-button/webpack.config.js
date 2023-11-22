const path = require('path');

const {
  NormalModuleReplacementPlugin
} = require('webpack');

const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'index.js',
  },
  mode: 'development',
  entry: './app/index.js',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.svg$/,
        use: 'raw-loader'
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'app/index.html', to: '.' }
      ]
    }),
    new NormalModuleReplacementPlugin(
      /^(..\/preact|preact)(\/[^/]+)?$/,
      function(resource) {

        const replMap = {
          'preact/hooks': path.resolve('node_modules/preact/hooks/dist/hooks.module.js'),
          'preact/jsx-runtime': path.resolve('node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js'),
          'preact': path.resolve('node_modules/preact/dist/preact.module.js'),
          '../preact/hooks': path.resolve('node_modules/preact/hooks/dist/hooks.module.js'),
          '../preact/jsx-runtime': path.resolve('node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js'),
          '../preact': path.resolve('node_modules/preact/dist/preact.module.js')
        };

        const replacement = replMap[resource.request];

        if (!replacement) {
          return;
        }

        resource.request = replacement;
      }
    )
  ]
};