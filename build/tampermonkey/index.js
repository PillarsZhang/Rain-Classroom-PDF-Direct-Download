/* eslint-env node */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

var package_json = fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8');
var version = JSON.parse(package_json).version;

String.prototype.render = function (context) {
    // eslint-disable-next-line no-useless-escape
    return this.replace(/\{\{([^\}]+)\}\}/g, (match, key) => (context[key]||match));
};

var BannerPlugin = new webpack.BannerPlugin({
    raw: true,
    entryOnly: true,
    banner: () => {
        var template = fs.readFileSync(path.resolve(__dirname, './template.txt'), 'utf-8');
        var banner = template.render({ version });
        return banner;
    },
});

module.exports = { BannerPlugin };