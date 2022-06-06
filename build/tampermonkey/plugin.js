/* eslint-env node */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const ejs = require('ejs');

var package_json = fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8');
var name = JSON.parse(package_json).name;
var version = JSON.parse(package_json).version;

const require_sources = ["jsdelivr", "jsdelivr_fastly", "bcecdn_pizyds", "baomitu"]
const require_source = require_sources[3]

function getAtRequires(source="jsdelivr", mode="dev") {
    let requires = JSON.parse(fs.readFileSync(path.resolve(__dirname, './requires_hash.json'), 'utf-8'));
    return requires.map(r => ({
        "url": r[mode][source],
        "hash": r[mode]["hash"]
    }));
}

function createNewChromeDevelopApi(template){
    var apiPath = path.resolve(__dirname, '../../dev/[chrome-develop-api] rain-classroom-pdf-direct-download.user.temp.js');
    var tempScriptPath = path.resolve(__dirname, '../../dist/rain-classroom-pdf-direct-download.user.temp.js');
    let at_requires = getAtRequires(require_source, "dev")
    at_requires.push({"url": `file:///${encodeURI(tempScriptPath.replaceAll('\\', '/'))}`})
    var chromeDevelopApi = template({ version, prefix: "[chrome-develop-api] ", at_requires });
    fs.writeFileSync(apiPath, chromeDevelopApi);
}

var BannerPlugin = new webpack.BannerPlugin({
    raw: true,
    entryOnly: true,
    banner: () => {
        var str = fs.readFileSync(path.resolve(__dirname, './template.ejs'), 'utf-8');
        var template = ejs.compile(str);
        createNewChromeDevelopApi(template);
        let at_requires = getAtRequires(require_source, "prod")
        var banner = template({ version, prefix: "", at_requires });
        return banner;
    },
});

var DefinePlugin = new webpack.DefinePlugin({
    'window.PIZYDS_RAIN.NAME': JSON.stringify(name),
    'window.PIZYDS_RAIN.VERSION': JSON.stringify(version),
    'window.PIZYDS_RAIN.TIMESTAMP': JSON.stringify(Date.now())
});

module.exports = { BannerPlugin, DefinePlugin };