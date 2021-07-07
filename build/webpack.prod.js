/* eslint-env node */

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({ 'window.PIZYDS_RAIN.MODE': JSON.stringify('production') })
    ],
    externals: {
        jspdf: 'jspdf',
        html2canvas: 'html2canvas',
        "hybrid-crypto-js": 'Crypt'
    }
});