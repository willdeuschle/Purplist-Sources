module.exports = {
    entry: [
        './static/src/index.js'
    ],
    output: {
        path: __dirname + '/static/dist/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, include: __dirname + '/static', loader: 'babel-loader'}
        ]
    }
}
