import get_url_slides from './get_url_slides.js';
import image_process from './image_process.js';
import pdf_process from './pdf_process.js';
import get_html_slides from './get_html_slides.js';
import html2canvas_hd from './html2canvas_hd.js';
import get_answers from './get_answers.js';
import { refreshProcessStatus, sleep } from './public.js';
import { ans_config } from './common.js';

/**
 * 按钮触发PDF生成逻辑
 * @param el_dialog 整体 dialog DOM 对象
 * @param url_type URL 类型
 * @return {void}
 */
export default function (el_dialog, url_type = 1){
    var type_fun = [{
        type: 0,
        fun: () => {
            console.log(`雨课堂课件PDF下载工具：PDF生成逻辑未知错误 - type ${url_type}`);
            return false;
        }
    },{
        type: 1,
        fun: () => {
            var url_slides = get_url_slides(el_dialog);
            if (url_slides.length > 0){
                refreshProcessStatus("处理图片...");
                console.groupCollapsed("雨课堂课件PDF下载工具：处理图片...");
                image_process(url_slides)
                    .then(async img_list => {
                    console.groupEnd();
                    refreshProcessStatus("生成PDF...");
                    await sleep(200);
                    var ppt_name = document.getElementsByClassName("ppt_name")[0].innerText;
                    var filename = ppt_name + ".pdf";
                    var answer_list = ans_config.enabled ? get_answers(url_slides): [];
                    pdf_process(img_list, filename, answer_list);
                    refreshProcessStatus(false);
                })
            } else{
                alert("雨课堂课件PDF下载工具：没有提取到图片");
            }
        }
    },{
        type: 2,
        fun: () => {
            var html_slides = get_html_slides(el_dialog);
            if (html_slides){
                refreshProcessStatus("处理HTML...");
                //HTML转图片
                html2canvas_hd().then(async img_list => {
                    refreshProcessStatus("生成PDF...");
                    await sleep(200);
                    var ppt_name = document.getElementsByClassName("ppt_name")[0].innerText;
                    var filename = ppt_name + ".pdf";
                    var answer_list = [];
                    pdf_process(img_list, filename, answer_list);
                    refreshProcessStatus(false);
                })
            } else{
                alert("雨课堂课件PDF下载工具：没有提取到图片");
            }
        }
    }];
    return type_fun.find(value => value.type == url_type).fun();
}
