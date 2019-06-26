module.exports = {
    entry: './src/logic/content.js',
    node: { fs: 'empty' },
    mode: 'production',
    output: {
        filename: 'content.js',
        path: __dirname + '/../build/src'
    }
}