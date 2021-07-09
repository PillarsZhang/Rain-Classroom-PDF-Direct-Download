/* eslint-env node */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

var package_json = fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8');
var name = JSON.parse(package_json).name;
var version = JSON.parse(package_json).version;

String.prototype.render = function (context) {
    // eslint-disable-next-line no-useless-escape
    return this.replace(/\{\{([^\}]+)\}\}/g, (match, key) => (context[key]||""));
};

function createNewChromeDevelopApi(template){
    var apiPath = path.resolve(__dirname, '../../dev/[chrome-develop-api] Rain Classroom PDF Direct Download.user.temp.js');
    var tempScriptPath = path.resolve(__dirname, '../../dist/Rain Classroom PDF Direct Download.user.temp.js');
    var requireText = `\n// @require      file:///${encodeURI(tempScriptPath.replaceAll('\\', '/'))}`
    var chromeDevelopApi = template.render({ version, require: requireText, prefix: "[chrome-develop-api] " });
    fs.writeFileSync(apiPath, chromeDevelopApi);
}

var BannerPlugin = new webpack.BannerPlugin({
    raw: true,
    entryOnly: true,
    banner: () => {
        var template = fs.readFileSync(path.resolve(__dirname, './template.txt'), 'utf-8');
        createNewChromeDevelopApi(template);
        var banner = template.render({ version });
        return banner;
    },
});

var DefinePlugin = new webpack.DefinePlugin({
    'window.PIZYDS_RAIN.NAME': JSON.stringify(name),
    'window.PIZYDS_RAIN.VERSION': JSON.stringify(version),
    'window.PIZYDS_RAIN.TIMESTAMP': JSON.stringify(Date.now())
});

module.exports = { BannerPlugin, DefinePlugin };