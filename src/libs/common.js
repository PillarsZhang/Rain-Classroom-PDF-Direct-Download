//对自动添加客观题答案到PPT页面的配置
export var ans_config = {
    enabled: true,
    right: 30,
    up: 25,
    fontSize: 40,
    fontColor: "#000000"
};

//网址分类规则
export var url_match = [{
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
export var build_info = {
    name: window.PIZYDS_RAIN.NAME,
    version: window.PIZYDS_RAIN.VERSION,
    timestamp: window.PIZYDS_RAIN.TIMESTAMP,
}

export var drm_config = {
    enabled: true
};