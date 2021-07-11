import { url_match } from "./libs/common.js";
import button_download from "./libs/button_download.js"

var realTimeSearchError = {
    count: () => {
        realTimeSearchError.num++;
        if (realTimeSearchError.num > realTimeSearchError.maxNum){
            clearInterval(realTimeSearchError.interval);
            realTimeSearchError.num = 0;
            console.log("雨课堂课件PDF下载工具：按钮注入超时，请重新刷新网页，或提交反馈");
            alert("雨课堂课件PDF下载工具：按钮注入超时，请重新刷新网页，或提交反馈");
        }
    },
    num: 0,
    maxNum: 25,
    interval: null
}

if (!checkFlagMeta()){
    addFlagMeta();
    console.log("雨课堂课件PDF下载工具：已载入");
    //实时查找PPT窗口
    realTimeSearchError.interval = setInterval(()=>{
        var url_type, el_dialog;
        (url_type = check_url()) && (el_dialog = find_basePPTDialog()) && !button_download(el_dialog, url_type) && realTimeSearchError.count();
    }, 200);
}

function addFlagMeta(){
    var flagMeta = document.createElement('meta');
    flagMeta.name = 'pizyds_rain';
    flagMeta.content = 'https://www.pizyds.com/rain-classroom-pdf-direct-download';
    document.head.appendChild(flagMeta);
}

function checkFlagMeta(){
    return document.head.querySelector("[name~=pizyds_rain]");
}

//更改为内部校验链接，因为大量ajax页面跳转的存在
function check_url(){
    var url_found = url_match.find(value => value.reg.test(window.location.href));
    if (url_found){
        return url_found.type;
    } else{
        return false;
    }
}

//查找PPT窗口
function find_basePPTDialog(){
    var el_dialogs = document.getElementsByClassName("basePPTDialog");
    if (el_dialogs.length == 1){
        return el_dialogs[0];
    } else{
        return false;
    }
}
