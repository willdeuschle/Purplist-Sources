module.exports = {
    entry: [
        './static/src/js/index.js'
    ],
    output: {
        path: __dirname + '/static/dist/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, include: __dirname + '/static/src', loader: 'babel-loader'},
            { test: /\.css$/, include: __dirname + '/static/src', loader: 'style-loader!css-loader' }
        ]
    }
}
