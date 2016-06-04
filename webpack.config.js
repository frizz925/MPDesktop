var webpack = require('webpack');
var path = require('path');

var config = {
    devtool: 'eval',
    entry: [
        /*
        'webpack-dev-server/client?http://127.0.0.1:3000',
        'webpack/hot/only-dev-server',
        */
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
            loaders: [/* 'react-hot', */ 'babel', 'react-map-styles'],
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
        //new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            _: "lodash",
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ]
};

if (process.env.NODE_ENV === "production") {
    config.devtool = "cheap-module-source-map";
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
               warnings: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        })
    );
} else {
    config.plugins.push(
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"'
        })
    );
}

module.exports = config;
