var webpack = require('webpack');
var env = process.env.WEBPACK_ENV;
var FIREBASE_ID = process.env.FIREBASE_ID;
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
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass'],
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000',
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
        FIREBASE_ID: JSON.stringify(FIREBASE_ID),
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
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
