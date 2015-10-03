var webpack = require('webpack');
var env = process.env.WEBPACK_ENV;
var WebpackDevServer = require('webpack-dev-server');

var appName = 'app';
var host = '0.0.0.0';
var port = '3000';

var config = {
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    filename: appName + '.js',
    publicPath: __dirname + '/public'
  },
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      }
    ]
  }
};

if (env === 'dev') {
  new WebpackDevServer(webpack(config), {
    contentBase: './dist',
    hot: true,
    debug: true
  }).listen(port, host, function (err, result) {
    if (err) {
      console.log(err);
    }
  });
  console.log('-------------------------');
  console.log('Local web server runs at http://' + host + ':' + port);
  console.log('-------------------------');
}

module.exports = config;
