/* eslint-env node */

const path = require('path');
const tampermonkey = require('./tampermonkey');

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
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: { plugins: () =>[ require('autoprefixer') ] }
                    }
                },
                'sass-loader'
            ],
        },{
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/inline',
        },{
            test: /\.(txt|pem|ejs)$/i,
            type: 'asset/source'
        }]
    },
    plugins: [
        tampermonkey.BannerPlugin,
        tampermonkey.DefinePlugin
    ],
    output: {
        filename: 'Rain Classroom PDF Direct Download.user.js',
        path: path.resolve(__dirname, '../dist'),
        clean: true,
    }
};