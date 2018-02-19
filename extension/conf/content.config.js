module.exports = {
    entry: ['./bootstrap.js'],
    node: { fs: 'empty' },
    output: {
        filename: 'content.js',
        path: __dirname + '/../build'
    }
}