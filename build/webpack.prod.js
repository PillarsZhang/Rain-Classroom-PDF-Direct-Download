/* eslint-env node */

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const path = require('path');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({ 'window.PIZYDS_RAIN.MODE': JSON.stringify('production') })
    ],
    output: {
        filename: 'rain-classroom-pdf-direct-download.user.js',
        path: path.resolve(__dirname, '../dist')
    },
    optimization: {
        minimize: false
    }
});