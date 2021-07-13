/* eslint-env node */

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    plugins: [
        new webpack.DefinePlugin({ 'window.PIZYDS_RAIN.MODE': JSON.stringify('development') })
    ],
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        compress: true,
        https: true,
        port: 8081,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
        allowedHosts: [
            '.yuketang.cn'
        ]
    },
    output: {
        filename: 'rain-classroom-pdf-direct-download.user.temp.js',
        path: path.resolve(__dirname, '../dist')
    }
});