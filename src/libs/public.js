import $ from "jquery";
import { build_info, env_config } from "./common";
import { SemVer } from "semver";

//按钮文本刷新
export function refreshProcessStatus(processStatus){
    if (!processStatus){
        $("#pizyds_rain_running").attr("hidden", "");
        $("#pizyds_rain_waiting").removeAttr("hidden");
    } else{
        $("#pizyds_rain_running_text").html(processStatus);
        $("#pizyds_rain_waiting").attr("hidden", "");
        $("#pizyds_rain_running").removeAttr("hidden");
    }
}

//修改自：http://www.jsfun.cn/#textBecomeImg
//js使用canvas将文字转换成图像数据base64
export function text2img(text, fontsize, fontcolor){
    var canvas = document.createElement('canvas');
    canvas.height = parseInt(fontsize * 1.2);
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = fontcolor;
    ctx.font = fontsize + "px Arial";

    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, fontsize/2);

    canvas.width = ctx.measureText(text).width;
    ctx.fillStyle = fontcolor;
    ctx.font = fontsize + "px Arial";
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, fontsize/2);

    var dataUrl = canvas.toDataURL('image/png');
    return {data: dataUrl, width: canvas.width, height: canvas.height};
}

//来自：https://www.cnblogs.com/ranyonsue/p/7596347.html
//HTML删除节点
export function removeElement(_element){
    var _parentElement = _element.parentNode;
    if(_parentElement){
        _parentElement.removeChild(_element);
    }
}

//休眠
export var sleep = (time) => new Promise(reslove => setTimeout(reslove, time));

/**
 * 调整 SVG 尺寸
 * @param {string} svg SVG 字符串
 * @param {number} width 宽度
 * @param {number} height 高度
 * @return {void}
 */
export function adjustSVGSize(svg, width, height = null){
    var node = $.parseHTML(svg)[0];
    var newHeight = height ? height : width / parseInt($(node).attr("width")) * parseInt($(node).attr("height"));
    var newWidth = width ? width : height / parseInt($(node).attr("height")) * parseInt($(node).attr("width"));
    $(node).attr("height", newHeight);
    $(node).attr("width", newWidth);
    return node.outerHTML;
}

/**
 * 给 SVG 添加 css
 * @param {string} svg SVG 字符串
 * @param {string} css css
 * @return {void}
 */
export function addSVGClass(svg, css){
    var node = $.parseHTML(svg)[0];
    $(node).addClass(css);
    return node.outerHTML;
}

export function judgeVersionUpdate() {
    if (SemVer.neq(env_config.version, build_info.version)){
        if (SemVer.eq(env_config.version, "0.0.0")){
            return "new";
        } else if (SemVer.gt(env_config.version, build_info.version)){
            return "down";
        } else if (SemVer.lt(env_config.version, build_info.version)){
            return "up";
        }
    } else {
        return false;
    } 
}


export var textVersionUpdate = {
    "new": `感谢！新安装：${env_config.version} -> ${build_info.version}`,
    "up": `感谢！已升级：${env_config.version} -> ${build_info.version}`,
    "down": `啊？已降级：${env_config.version} -> ${build_info.version}`
}

export function clearVersionUpdate () {
    if (judgeVersionUpdate()){
        env_config.version = build_info.version;
        return true;
    } else {
        return false;
    }
}