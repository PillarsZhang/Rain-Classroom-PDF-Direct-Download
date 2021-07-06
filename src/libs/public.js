import { ans_config } from "./common.js";

/**
 * 对添加客观题答案到PPT的开关
 * @return {void}
 */
export function switch_answer(){
    var el_switchAnswer = document.getElementsByClassName("pizyds_switchAnswer")[0];
    if (ans_config.enabled){
        el_switchAnswer.innerHTML = "<del>[ 答案 ]</del>";
        ans_config.enabled = false;
    } else{
        el_switchAnswer.innerHTML = "[ 答案 ]";
        ans_config.enabled = true;
    }
}

//按钮文本刷新
export function refreshProcessStatus(processStatus){
    var el_download = document.getElementsByClassName("pizyds_download")[0];
    el_download.innerHTML = `<i class="iconfont icon-pizyds-rain-down-xiazai"></i> ${processStatus}`;
}

//HTML字符串转节点
export function create_node_from_html(html){
    let tempNode = document.createElement('div');
    tempNode.innerHTML = html;
    return tempNode.firstChild;
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