module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      './node_modules/babel-core/browser-polyfill.js',
      'src/test/**/*.spec.*',
    ],
    webpack: {
      module: {
        preLoaders: [
          {
            test: /\.jsx$|\.js$/,
            loader: 'eslint-loader',
            exclude: /node_modules/,
          },
        ],
        loaders: [{
          test: /\.jsx$|\.js$/,
          exclude: /node_modules/,
          loaders: ['babel'],
        }],
      },
      resolve: {
        extensions: ['', '.js', '.jsx'],
      },
    },
    preprocessors: {
      'src/test/**/*.spec.js': ['webpack'],
    },
    reporters: ['mocha'],
    plugins: [
      'karma-mocha-reporter',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-webpack',
      'karma-chai',
      'karma-mocha',
    ],
  });
};
