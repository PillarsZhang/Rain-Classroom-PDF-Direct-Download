/* globals jspdf UPNG html2canvas */

// ==UserScript==
// @name         Rain Classroom PDF Direct Download
// @name:zh-CN   雨课堂课件PDF下载工具
// @namespace    https://www.pizyds.com/
// @version      1.2.1
// @description  Automatic generation of direct download PDF on Rain Classroom
// @description:zh-CN 在雨课堂页面自动生成PDF版本课件提供下载
// @author       PillarsZhang
// @homepage     https://www.pizyds.com/rain-classroom-pdf-direct-download
// @supportURL   https://www.pizyds.com/rain-classroom-pdf-direct-download
// @license      MIT
// @match        https://*.yuketang.cn/*
// @icon         https://www.yuketang.cn/static/images/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.3.1/jspdf.umd.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/pako/2.0.3/pako.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/upng-js/2.1.0/UPNG.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.5.0-beta4/html2canvas.js
// @resource     pizyds_iconfont_css https://at.alicdn.com/t/font_2448118_l5d66dc50k9.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    console.log("雨课堂课件PDF下载工具：已载入");

    //对自动添加客观题答案到PPT页面的配置
    var ans_config = {
        enabled: true,
        right: 30,
        up: 25,
        fontSize: 40,
        fontColor: "#000000"
    };

    //网址分类规则
    var url_match = [
        {
            reg: /https:\/\/.*\.yuketang\.cn\/v2\/web\/student\/.*/,
            type: 1
        },{
            reg: /https:\/\/.*\.yuketang\.cn\/v2\/web\/student-v3\/.*/,
            type: 1
        },{
            reg: /https:\/\/.*\.yuketang\.cn\/v2\/web\/studentCards\/.*/,
            type: 2
        }
    ];

    //jsPDF用于PDF生成，UPNG、pako用于PNG的反交错和压缩
    const {jsPDF} = jspdf;

    //下载的图标，感谢iconfont
    const pizyds_iconfont_css = GM_getResourceText("pizyds_iconfont_css");
    GM_addStyle(pizyds_iconfont_css);

    //实时查找PPT窗口
    setInterval(()=>{
        var url_type, el_dialog;
        (url_type = check_url()) && (el_dialog = find_basePPTDialog()) && add_button_download(el_dialog, url_type);
    },200);

    //更改为内部校验链接，因为大量ajax页面跳转的存在
    function check_url(){
        var url_found = url_match.find(value => value.reg.test(window.location.href));
        if (url_found){
            return url_found.type;
        } else{
            return false;
        }
    }

    //按钮触发PDF生成逻辑
    function download_process(el_dialog, url_type = 1){
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
                        refreshProcessStatus("下载课件");
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
                        refreshProcessStatus("下载课件(Beta)");
                    })
                } else{
                    alert("雨课堂课件PDF下载工具：没有提取到图片");
                }
            }
        }];
        return type_fun.find(value => value.type == url_type).fun();
    }

    //第一步-借助UPNG，进行图片下载与反交错、压缩处理
    function image_process(url_slides){
        var promiseList = new Array(url_slides.length);
        var finished_num = 0;
        var count_finished_num = (index) => {
            var processStatus = `${++finished_num}/${url_slides.length}`;
            refreshProcessStatus(`处理图片(${processStatus})`);
            console.log(`雨课堂课件PDF下载工具：${processStatus} - 第${index+1}页 - ${url_slides[index]}`);
        }
        for (let i = 0; i < url_slides.length; i++){
            promiseList[i] = fetch(url_slides[i]).then(response => {
                return response.arrayBuffer();
            }).then(arrayBuffer_origin => {
                var img = UPNG.decode(arrayBuffer_origin);
                var rgba = UPNG.toRGBA8(img);
                var arrayBuffer_compress = UPNG.encode(rgba, img.width, img.height);
                count_finished_num(i);
                return {unit8: new Uint8Array(arrayBuffer_compress), width: img.width, height: img.height};
            }).catch(err => {
                console.error(err);
                alert("雨课堂课件PDF下载工具：图像处理出错");
            });
        }
        return Promise.all(promiseList);
    }

    //第二步-借助jsPDF，进行PDF的生成
    function pdf_process(img_list, filename, answer_list){
        console.groupCollapsed("雨课堂课件PDF下载工具：生成PDF...");
        var doc = new jsPDF({
            orientation: "landscape",
            unit: "px",
            format: [img_list[0].width, img_list[0].height],
            hotfixes: ["px_scaling"]
        });
        var addPPT = (index) => {
            console.log(`雨课堂课件PDF下载工具：第 ${index+1} 页 - PPT`);
            doc.addImage(img_list[index].unit8, 'PNG', 0, 0, img_list[index].width, img_list[index].height, '', 'FAST');
            let answer_item = answer_list.find(obj => obj.index == index);
            if (answer_item && answer_item.ans != "") {
                let answer_img = text2img(answer_item.ans, ans_config.fontSize, ans_config.fontColor);
                console.log(`雨课堂课件PDF下载工具：第 ${index+1} 页 - 答案 - ${answer_item.ans}`);
                doc.addImage(answer_img.data, 'PNG', img_list[index].width - answer_img.width - ans_config.right,
                             ans_config.up, answer_img.width, answer_img.height, '', 'FAST');
            };
        };
        addPPT(0);
        for (let i = 1; i < img_list.length; i++){
            doc.addPage([img_list[i].width, img_list[i].height], "landscape");
            addPPT(i);
        }
        console.groupEnd();
        doc.save(filename);
        console.log(`雨课堂课件PDF下载工具：完成下载`);
        console.log(`雨课堂课件PDF下载工具：https://www.pizyds.com/rain-classroom-pdf-direct-download/`);
    }

    //HTML转高清Canvas，一大堆神奇操作驯服原版html2canvas
    async function html2canvas_hd(){
        console.groupCollapsed("雨课堂课件PDF下载工具：HTML转高清Canvas...");
        var hd_sample_sacle = 4;
        var hd_output_sacle = 2;
        var c = document.createElement("canvas");
        var pos = {};

        function oncloneFunction(clonedDocument, index){
            //画布准备，高采样
            var el_ppts = clonedDocument.getElementsByClassName("pizyds_el_ppt");
            var el_ppt = el_ppts[index];
            el_ppt.style.transform = "translate3d(-50%, -50%, 0px)";
            pos = {
                w: el_ppt.getBoundingClientRect(),
                o: { width: parseInt(el_ppt.style.width), height: parseInt(el_ppt.style.height) },
                e: { width: null, height: null }
            };
            pos.e.width = pos.o.width * hd_sample_sacle;
            pos.e.height = pos.o.height * hd_sample_sacle;
            console.log(pos);
            c.width = pos.e.width;
            c.height = pos.e.height;
            var ctx = c.getContext("2d");
            //ctx.imageSmoothingEnabled = false;
            ctx.scale(pos.e.width / pos.w.width, pos.e.height / pos.w.height);
            ctx.translate(- pos.w.left, - pos.w.top);

            var el_slides = clonedDocument.getElementsByClassName("pizyds_el_slide");
            el_slides = Array.from(el_slides);
            for (let i = 0; i < index; i++) removeElement(el_slides[i]);
            el_slides[index].style.opacity = 1;
            el_slides[index].style.transform = "translate3d(0px, 0px, 0px)";
        }

        async function render(index){
            console.log(`雨课堂课件PDF下载工具：${processStatus} - 高采样`);
            var el_ppt = el_ppts[index];
            //html2canvas
            console.groupCollapsed(`雨课堂课件PDF下载工具：${processStatus} - html2canvas 日志`);
            await html2canvas(el_ppt, {
                logging: true,
                useCORS: true,
                canvas:c,
                onclone: clonedDocument => oncloneFunction(clonedDocument, index)
            });
            console.groupEnd();
            //压缩尺寸，低采样
            console.log(`雨课堂课件PDF下载工具：${processStatus} - 低采样`);
            var c2 = document.createElement('canvas');
            c2.width = pos.o.width * hd_output_sacle;
            c2.height = pos.o.height * hd_output_sacle;
            var ctx2 = c2.getContext('2d');
            ctx2.drawImage(c, 0, 0, c2.width, c2.height);
            var dta = ctx2.getImageData(0, 0, c2.width, c2.height).data;
            var png = UPNG.encode([dta.buffer], c2.width, c2.height, 0);
            return {unit8: new Uint8Array(png), width: c2.width, height: c2.height};
        }

        var unit8_ppts = [];
        var el_ppts = document.getElementsByClassName("pizyds_el_ppt");
        refreshProcessStatus("转换HTML...");
        for (let i = 0; i < el_ppts.length; i++){
            var processStatus = `${i+1}/${el_ppts.length}`;
            refreshProcessStatus(`转换HTML(${processStatus})`);
            unit8_ppts[i] = await render(i);
            console.log(`雨课堂课件PDF下载工具：${processStatus} - 第${i+1}页 - size: ${unit8_ppts[i].unit8.length}, ${unit8_ppts[i].width}x${unit8_ppts[i].height}`);
        }
        console.groupEnd();
        console.log(`雨课堂课件PDF下载工具：完成转换`);
        return unit8_ppts;
    }

    //按钮文本刷新
    function refreshProcessStatus(processStatus){
        var el_download = document.getElementsByClassName("pizyds_download")[0];
        el_download.innerHTML = `<i class="iconfont icon-pizyds-rain-down-xiazai"></i> ${processStatus}`;
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

    //客观题答案
    function get_answers(url_slides){
        var el_problem = document.getElementById("problem");
        var answer_list = [];
        if (el_problem){
            var el_exercises_info = el_problem.getElementsByClassName("exercises_info");
            for (let i = 0; i < el_exercises_info.length; i++){
                let el_url = el_exercises_info[i].querySelector(".img_box>img");
                let el_ans = el_exercises_info[i].querySelector(".answer_info>.correct_answer");
                var answer_item = { url: el_url ? el_url.src : "", ans: el_ans ? el_ans.innerText : "", index: -1 };
                answer_item.index = url_slides.indexOf(answer_item.url);
                answer_list.push(answer_item);
            }
        }
        console.groupCollapsed(`雨课堂课件PDF下载工具：提取到 ${answer_list.length} 项答案`);
        console.table(answer_list);
        console.groupEnd();
        return answer_list;
    }

    //对添加客观题答案到PPT的开关
    function switch_answer(processStatus){
        var el_switchAnswer = document.getElementsByClassName("pizyds_switchAnswer")[0];
        if (ans_config.enabled){
            el_switchAnswer.innerHTML = "<del>[ 答案 ]</del>";
            ans_config.enabled = false;
        } else{
            el_switchAnswer.innerHTML = "[ 答案 ]";
            ans_config.enabled = true;
        }
    }

    //PPT图片链接提取
    function get_url_slides(el_dialog){
        try{
            var el_swiper = el_dialog.getElementsByClassName("pptSwiper")[0];
            var el_slides = el_swiper.getElementsByClassName("swiper-slide");
            var url_slides = new Array(el_slides.length);
            for (let i = 0; i < el_slides.length; i++){
                url_slides[i] = el_slides[i].getElementsByTagName("img")[0].src;
            }
            console.groupCollapsed(`雨课堂课件PDF下载工具：提取到 ${url_slides.length} 页 PPT`);
            console.table(url_slides);
            console.groupEnd();
            return url_slides;
        } catch(err){
            return new Array();
        }
    }

    //PPT HTML Class 标注（针对发布的“课件”类型）
    function get_html_slides(el_dialog){
        try{
            var el_swiper = el_dialog.getElementsByClassName("pptSwiper")[0];
            var el_slides = el_swiper.getElementsByClassName("swiper-slide");
            var html_slides = new Array(el_slides.length);
            for (let i = 0; i < el_slides.length; i++){
                el_slides[i].classList.add("pizyds_el_slide");
                el_slides[i].getElementsByClassName("courseware heightPriority")[0].classList.add("pizyds_el_ppt");;
            }
            console.log(`雨课堂课件PDF下载工具：提取到 ${el_slides.length} 页 PPT`);
            return true;
        } catch(err){
            console.error(err);
            return false;
        }
    }

    //按钮注入
    function add_button_download(el_dialog, url_type = 1){
        var type_fun = [{
            type: 0,
            fun: () => {
                console.log(`雨课堂课件PDF下载工具：按钮注入未知错误 - type ${url_type}`);
                return false;
            }
        },{
            type: 1,
            fun: () => {
                var el_header = el_dialog.getElementsByClassName("layout_header")[0];
                if (el_header.getElementsByClassName("pizyds_download").length == 0){
                    var el_download = create_node_from_html(`<span class="print pizyds_download" style="right:160px" title="点击下载PPT">
                      <i class="iconfont icon-pizyds-rain-down-xiazai"></i> 下载课件</span>`);
                    el_download.onclick = () => download_process(el_dialog, url_type);
                    el_header.appendChild(el_download);
                    var el_switchAnswer = create_node_from_html(`<span class="print pizyds_switchAnswer" style="right:110px" title="点击切换是否添加客观题答案到PPT">[ 答案 ]</span>`);
                    if (!ans_config.enabled) el_switchAnswer.innerHTML = "<del>[ 答案 ]</del>";
                    el_switchAnswer.onclick = () => switch_answer();
                    el_header.appendChild(el_switchAnswer);
                    console.log(`雨课堂课件PDF下载工具：按钮注入成功 - type ${url_type}`);
                    return true;
                }
            }
        },{
            type: 2,
            fun: () => {
                var el_header = el_dialog.getElementsByClassName("layout-header")[0];
                if (el_header.getElementsByClassName("pizyds_download").length == 0){
                    var el_download = create_node_from_html(`<span class="button pizyds_download" title="点击下载PPT（功能可能不稳定，已知阴影丢失）">
                      <i class="iconfont icon-pizyds-rain-down-xiazai"></i> 下载课件(Beta)</span>`);
                    el_download.onclick = () => download_process(el_dialog, url_type);
                    el_header.insertBefore(el_download, el_header.getElementsByClassName("button")[0]);
                    console.log(`雨课堂课件PDF下载工具：按钮注入成功 - type ${url_type}`);
                    return true;
                }
            }
        }];
        return type_fun.find(value => value.type == url_type).fun();
    }

    //HTML字符串转节点
    function create_node_from_html(html){
        let tempNode = document.createElement('div');
        tempNode.innerHTML = html;
        return tempNode.firstChild;
    }

    //修改自：http://www.jsfun.cn/#textBecomeImg
    //js使用canvas将文字转换成图像数据base64
    function text2img(text, fontsize, fontcolor){
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
    function removeElement(_element){
        var _parentElement = _element.parentNode;
        if(_parentElement){
            _parentElement.removeChild(_element);
        }
    }

    //休眠
    var sleep = (time) => new Promise(reslove => setTimeout(reslove, time));
})();