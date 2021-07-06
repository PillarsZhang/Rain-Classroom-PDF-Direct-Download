import { refreshProcessStatus, removeElement } from "./public.js";
import html2canvas from "html2canvas";
import UPNG from "upng-js";

var hd_sample_sacle = 4;
var hd_output_sacle = 2;

function oncloneFunction(clonedDocument, index, { c, pos }){
    //画布准备，高采样
    var el_ppts = clonedDocument.getElementsByClassName("pizyds_el_ppt");
    var el_ppt = el_ppts[index];
    el_ppt.style.transform = "translate3d(-50%, -50%, 0px)";
    pos.w = el_ppt.getBoundingClientRect();
    pos.o = { width: parseInt(el_ppt.style.width), height: parseInt(el_ppt.style.height) };
    pos.e = { width: pos.o.width * hd_sample_sacle, height: pos.o.height * hd_sample_sacle };
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

async function render(index, { el_ppts, processStatus }){
    var c = document.createElement("canvas");
    var pos = { w: null, o: null, e: null };

    console.log(`雨课堂课件PDF下载工具：${processStatus} - 高采样`);
    var el_ppt = el_ppts[index];
    //html2canvas
    console.groupCollapsed(`雨课堂课件PDF下载工具：${processStatus} - html2canvas 日志`);
    return html2canvas(el_ppt, {
        logging: true,
        useCORS: true,
        canvas:c,
        onclone: clonedDocument => oncloneFunction(clonedDocument, index, { c, pos })
    }).then(() => {
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
    });
}

/**
 * HTML转高清Canvas，一大堆神奇操作驯服原版html2canvas
 * @return {Array} PPT 的 RAW 图片
 */
export default async function(){
    console.groupCollapsed("雨课堂课件PDF下载工具：HTML转高清Canvas...");

    var unit8_ppts = [];
    var el_ppts = document.getElementsByClassName("pizyds_el_ppt");
    refreshProcessStatus("转换HTML...");
    for (let i = 0; i < el_ppts.length; i++){
        var processStatus = `${i+1}/${el_ppts.length}`;
        refreshProcessStatus(`转换HTML(${processStatus})`);
        unit8_ppts[i] = await render(i, { el_ppts, processStatus });
        console.log(`雨课堂课件PDF下载工具：${processStatus} - 第${i+1}页 - size: ${unit8_ppts[i].unit8.length}, ${unit8_ppts[i].width}x${unit8_ppts[i].height}`);
    }
    console.groupEnd();
    console.log(`雨课堂课件PDF下载工具：完成转换`);
    return unit8_ppts;
}