import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import __dirname from '../__dirname.js'

var package_json = fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8');
var version = JSON.parse(package_json).version;

//from: https://segmentfault.com/a/1190000013516128
String.prototype.render = function (context) {
    // eslint-disable-next-line no-useless-escape
    return this.replace(/\{\{([^\}]+)\}\}/g, (match, key) => (context[key]||match));
};

export default new webpack.BannerPlugin({
    raw: true,
    entryOnly: true,
    banner: () => {
        var template = fs.readFileSync(path.resolve(__dirname, './tampermonkeyBanner/template.txt'), 'utf-8');
        var banner = template.render({ version });
        return banner;
    },
});