module.exports = {
    entry: './bg.js',
    node: { fs: 'empty' },
    output: {
        filename: 'background.js',
        path: __dirname + '/../build'
    }
}