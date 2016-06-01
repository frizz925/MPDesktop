var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true
}).listen(3000, 'localhost', function(err, result) {
    if (err) {
        return console.error(err);
    }

    console.log("Dev server listening at http://localhost:3000/");
});
