module.exports = {
    entry: ['./logic/popup.js'],
    node: { fs: 'empty' },
    output: {
        filename: 'popup.js',
        path: __dirname + '/../build'
    }
}