module.exports = {
    entry: {
        'content.js': [
            './src/logic/content.js',
            './src/logic/operation.js',
            './src/logic/operation_result.js'
        ]
    },
    node: {
        fs: 'empty'
    },
    mode: 'production',
    output: {
        filename: 'content.js',
        path: __dirname + '/../build/src'
    },
    module: {
        rules: [{
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }]
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        minimize: true,
                        removeComments: false,
                        collapseWhitespace: false
                    }
                }]
            }
        ]
    }
}