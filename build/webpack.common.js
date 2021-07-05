/* eslint-env node */

const path = require('path');
const tampermonkey = require('./tampermonkey');

module.exports = {
    entry: {
        app: './src/index.js',
    },
    module: {
        rules: [{
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
        },{
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/inline',
        }],
    },
    plugins: [
        tampermonkey.BannerPlugin
    ],
    output: {
        filename: 'Rain Classroom PDF Direct Download.user.js',
        path: path.resolve(__dirname, '../dist'),
        clean: true,
    }
};