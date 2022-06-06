/* eslint-env node */

const tampermonkey = require('./tampermonkey/plugin');

module.exports = {
    entry: {
        app: './src/index.js',
    },
    module: {
        rules: [{
            test: /\.(css|scss)$/i,
            use: [
                'style-loader', 
                'css-loader', 
                'postcss-loader',
                'sass-loader'
            ],
        },{
            test: /\.(png|jpg|jpeg|gif)$/i,
            type: 'asset/inline',
        },{
            test: /\.(txt|pem|ejs|svg)$/i,
            type: 'asset/source'
        }]
    },
    plugins: [
        tampermonkey.BannerPlugin,
        tampermonkey.DefinePlugin
    ],
    externals: {
        jspdf: 'jspdf',
        html2canvas: 'html2canvas',
        // 'hybrid-crypto-js/web/hybrid-crypto.js': 'Crypt',
        jquery: 'jQuery'
    }
};