import { url_match } from "./libs/common.js";
import button_download from "./libs/button_download.js"

if (!checkFlagMeta()){
    addFlagMeta();
    console.log("雨课堂课件PDF下载工具：已载入");
    //实时查找PPT窗口
    setInterval(()=>{
        var url_type, el_dialog;
        (url_type = check_url()) && (el_dialog = find_basePPTDialog()) && button_download(el_dialog, url_type);
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
