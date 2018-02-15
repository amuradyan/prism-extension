module.exports = {
  entry: ['./popup.js'],
  node: { fs: 'empty' },
  output: {
    filename: 'popup_bundle.js',
    path: __dirname + '/build'
  }
}