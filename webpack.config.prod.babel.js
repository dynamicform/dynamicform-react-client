var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
var path = require('path');

const env = process.env.NODE_ENV;
const reactExternal  = {
    root: 'React',
    commonjs2: 'react',
    commonjs: 'react',
    amd: 'react'
};
const reduxExternal  = {
    root: 'Redux',
    commonjs2: 'redux',
    commonjs: 'redux',
    amd: 'redux'
};
const reactReduxExternal  = {
    root: 'ReactRedux',
    commonjs2: 'react-redux',
    commonjs: 'react-redux',
    amd: 'react-redux'
};

module.exports = {
    entry: {
        dynamicform: './src/components/DynamicForm.js'
    },
    output:{
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/',
        library: 'DynamicForm',
        libraryTarget: 'umd'
    },
    devtool:'source-map',
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
    externals: {
        'react': reactExternal,
        'redux': reduxExternal,
        'react-redux': reactReduxExternal
    },
    plugins:[
        new ExtractTextWebpackPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: true,
        //         drop_console: true,
        //     }
        // }),
    ]
};
