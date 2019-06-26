module.exports = {
    entry: './src/logic/background.js',
    node: { fs: 'empty' },
    mode: 'production',
    output: {
        filename: 'background.js',
        path: __dirname + '/../build'
    }
}