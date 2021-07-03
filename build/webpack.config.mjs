import path from 'path';
import tampermonkeyBanner from './tampermonkeyBanner/banner.mjs';
import __dirname from './__dirname.js'

export default {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'Rain Classroom PDF Direct Download.user.js',
        path: path.resolve(__dirname, '../dist'),
        clean: true,
    },
    //devtool: 'inline-source-map',
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
        tampermonkeyBanner
    ]
};