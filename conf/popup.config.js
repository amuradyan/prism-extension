module.exports = {
    entry: './src/logic/popup.js',
    node: { fs: 'empty' },
    mode: 'production',
    output: {
        filename: 'popup.js',
        path: __dirname + '/../build/src'
    }
}