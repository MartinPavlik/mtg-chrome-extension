module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: './extension/app/build/app.js' //this is the default name, so you can skip it
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
            presets: ['react', 'es2015']
        }
      },
      {
        test: /\.styl$/,
        loader: 'css-loader!stylus-loader?paths=node_modules/bootstrap-stylus/stylus/'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}