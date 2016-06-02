var webpack = require('webpack');
var path = require('path');

module.exports = {
    devtool: 'eval',
    entry: [
        'webpack-dev-server/client?http://127.0.0.1:3000',
        'webpack/hot/only-dev-server',
        __dirname + '/src/index.jsx'
    ],

    output: {
        path: path.join(__dirname, 'public/js'),
        filename: "bundle.js",
        publicPath: "/static/"
    },

    module: {
        loaders: [{
            test: /\.js(x)?$/,
            loaders: ['react-hot', 'babel'],
            include: path.join(__dirname, 'src')
        }, {
            test: /\.css$/,
            loaders: ['style', 'css']
        }]
    },

    resolve: {
        root: [
            path.join(__dirname, 'src')
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            "_": "lodash"
        })
    ]
};
