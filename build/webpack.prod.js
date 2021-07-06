/* eslint-env node */

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    externals: {
        jspdf: 'jspdf',
        html2canvas: 'html2canvas'
    }
});