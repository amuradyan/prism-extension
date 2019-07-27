module.exports = {
    entry: {
        'popup.js': [
            './src/logic/popup.js',
            './src/logic/operation_result.js',
            './src/logic/operation.js',
        ]    
    },
    node: {
        fs: 'empty'
    },
    mode: 'production',
    output: {
        filename: 'popup.js',
        path: __dirname + '/../build/src'
    },
    module: {
        rules: [{
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    }
}