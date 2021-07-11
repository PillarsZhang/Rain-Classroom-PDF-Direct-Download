//对自动添加客观题答案到PPT页面的配置
var ans_config = {
    _enabled: true,
    _fontSize: 40,
    right: 30,
    up: 20,
    fontColor: "#000000",
    text: {
        enabled: "课件附答案",
        fontSize: "答案字号"
    }
};

autoGMValue(ans_config, "ans_config");

var drm_config = {
    _enabled: true,
    text: {
        enabled: "DRM"
    }
};
autoGMValue(drm_config, "drm_config");

//网址分类规则
var url_match = [{
    reg: /https:\/\/.*\.yuketang\.cn\/v2\/web\/student\/.*/,
    type: 1
},{
    reg: /https:\/\/.*\.yuketang\.cn\/v2\/web\/student-v3\/.*/,
    type: 1
},{
    reg: /https:\/\/.*\.yuketang\.cn\/v2\/web\/studentCards\/.*/,
    type: 2
}];

//编译信息
var build_info = {
    name: window.PIZYDS_RAIN.NAME,
    version: window.PIZYDS_RAIN.VERSION,
    timestamp: window.PIZYDS_RAIN.TIMESTAMP,
}

export { ans_config, url_match, build_info, drm_config };

function autoGMValue(obj, objName){
    for (let keyTemp in obj){
        if (keyTemp.startsWith('_')){
            let _key = keyTemp; //内置值
            let key = _key.substring(1); //操作值
            let $key = '$' + key; //默认值
            let GMValueName = `${objName}.${key}`;
            obj[$key] = obj[_key];
            Object.defineProperty(obj, key, {
                set: function(val) {
                    this[_key] = val;
                    GM_setValue(GMValueName, this[_key]);
                    console.log(`雨课堂课件PDF下载工具：${this.text&&this.text[key]||GMValueName} - ${this[_key]}`);
                },
                get: function() {
                    this[_key] = GM_getValue(GMValueName, this[_key]);
                    return this[_key];
                },
            });
            refreshGMValue(obj, key);
        }
    }
}

function refreshGMValue(obj, key){
    return obj[key];
}