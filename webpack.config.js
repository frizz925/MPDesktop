var webpack = require('webpack');
var path = require('path');

module.exports = {
    devtool: 'eval',
    entry: [
        'webpack-dev-server/client?http://127.0.0.1:3000',
        'webpack/hot/only-dev-server',
        __dirname + '/src/web/index.jsx'
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
            include: [
                path.join(__dirname, 'src/web')
            ],
            exclude: [
                path.join(__dirname, 'public/js'),
                path.join(__dirname, 'src/backend')
            ]
        }, {
            test: /\.css$/,
            loaders: ['style', 'css'],
            exclude: [
                path.join(__dirname, 'public/css')
            ]
        }]
    },

    resolve: {
        root: [
            path.join(__dirname, 'src/web')
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            "_": "lodash",
            "$": "jquery"
        })
    ]
};
