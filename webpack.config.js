var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: ['webpack-hot-middleware/client','./client/index.js'],
  output: {
    path: path.join(__dirname, 'client'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
  ],
  module: {
    loaders: [{
      test: /.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react', 'stage-1', 'react-hmre'],
        plugins: ['react-html-attrs' , 'transform-class-properties', 'transform-decorators-legacy']
      }
},
    {   test: /\.css$/,
        use: [
            {loader: "style-loader"},
            {loader: "css-loader"}
        ]}
    ]
  }
}
