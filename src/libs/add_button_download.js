import icon_pizyds_rain_xiazai from '../images/iconfont/icon_pizyds_rain_xiazai.svg';
import { create_node_from_html, switch_answer } from './public.js';
import { ans_config } from './common.js'
import conf_panel from './conf_panel';
import download_process from './download_process.js';
import $ from 'jquery';

/**
 * 按钮注入
 * @param el_dialog 整体 dialog DOM 对象
 * @param url_type URL 类型
 * @return {void}
 */
export default function add_button_download(el_dialog, url_type = 1){
    var type_fun = [{
        type: 0,
        fun: () => {
            console.log(`雨课堂课件PDF下载工具：按钮注入未知错误 - type ${url_type}`);
            return false;
        }
    },{
        type: 1,
        fun: () => {
            $(el_dialog).addClass("pizyds_rain");
            var el_header = el_dialog.getElementsByClassName("layout_header")[0];
            if (el_header.getElementsByClassName("pizyds_download").length == 0){
                var el_download = create_node_from_html(`<span class="print pizyds_download" style="right:160px" title="点击下载PPT">
                <img src="${icon_pizyds_rain_xiazai}" width="14" height="14" style="vertical-align: middle"> 下载课件</span>`);
                el_download.onclick = () => download_process(el_dialog, url_type);
                el_header.appendChild(el_download);
                var el_switchAnswer = create_node_from_html(`<span class="print pizyds_switchAnswer" style="right:110px">[ 答案 ]</span>`);
                if (!ans_config.enabled) el_switchAnswer.innerHTML = "<del>[ 答案 ]</del>";
                el_switchAnswer.onclick = () => switch_answer();
                el_header.appendChild(el_switchAnswer);
                console.log(`雨课堂课件PDF下载工具：按钮注入成功 - type ${url_type}`);   conf_panel(el_switchAnswer);
                return true;
            }
        }
    },{
        type: 2,
        fun: () => {
            var el_header = el_dialog.getElementsByClassName("layout-header")[0];
            if (el_header.getElementsByClassName("pizyds_download").length == 0){
                var el_download = create_node_from_html(`<span class="button pizyds_download" title="点击下载PPT（功能可能不稳定，已知阴影丢失）">
                <img src="${icon_pizyds_rain_xiazai}" width="14" height="14" style="vertical-align: middle"> 下载课件(Beta)</span>`);
                el_download.onclick = () => download_process(el_dialog, url_type);
                el_header.insertBefore(el_download, el_header.getElementsByClassName("button")[0]);
                console.log(`雨课堂课件PDF下载工具：按钮注入成功 - type ${url_type}`);
                return true;
            }
        }
    }];
    return type_fun.find(value => value.type == url_type).fun();
}