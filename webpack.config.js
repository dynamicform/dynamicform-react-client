const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
    entry: {
        app: ['babel-polyfill','./public/index.js']
    },
    output:{
        path: path.resolve(__dirname, 'public'),
        filename: '[name].js',
        publicPath: '/',
    },
    module:{
        rules: [
            {
                test: /\.css$/ ,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                    publicPath: '/dist'
                })
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: 'file-loader?name=/images/[name].[ext]'
            },
            {
                test: /\.(svg|woff2|ttf|woff|eot)$/,
                use: 'file-loader?name=/fonts/[name].[ext]'
            },
            { test: /\.less$/, loader: "style-loader!css-loader!less-loader"}
        ]
    },
    devtool: 'eval-source-map',
    //配置开发webpack-dev-server
    devServer: {
        compress: true,
        stats: 'errors-only',
        open: true
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            inject: true,
            hash: true
        }),
        new ExtractTextWebpackPlugin({
            filename: '[name].css',
            allChunks: true
        })
    ]
};