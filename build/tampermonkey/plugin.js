/* eslint-env node */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const ejs = require('ejs');

var package_json = fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8');
var name = JSON.parse(package_json).name;
var version = JSON.parse(package_json).version;

function createNewChromeDevelopApi(template){
    var apiPath = path.resolve(__dirname, '../../dev/[chrome-develop-api] rain-classroom-pdf-direct-download.user.temp.js');
    var tempScriptPath = path.resolve(__dirname, '../../dist/rain-classroom-pdf-direct-download.user.temp.js');
    var requireText = `\n// @require      file:///${encodeURI(tempScriptPath.replaceAll('\\', '/'))}`
    var chromeDevelopApi = template({ version, require: requireText, prefix: "[chrome-develop-api] " });
    fs.writeFileSync(apiPath, chromeDevelopApi);
}

var BannerPlugin = new webpack.BannerPlugin({
    raw: true,
    entryOnly: true,
    banner: () => {
        var str = fs.readFileSync(path.resolve(__dirname, './template.ejs'), 'utf-8');
        var template = ejs.compile(str);
        createNewChromeDevelopApi(template);
        var banner = template({ version, require: "", prefix: "" });
        return banner;
    },
});

var DefinePlugin = new webpack.DefinePlugin({
    'window.PIZYDS_RAIN.NAME': JSON.stringify(name),
    'window.PIZYDS_RAIN.VERSION': JSON.stringify(version),
    'window.PIZYDS_RAIN.TIMESTAMP': JSON.stringify(Date.now())
});

module.exports = { BannerPlugin, DefinePlugin };