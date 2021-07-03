import {jsPDF} from 'jspdf';
import { text2img } from './public.js';
import { ans_config } from './common.js';

/**
 * 借助jsPDF，进行PDF的生成
 * @param img_list 图片列表
 * @param filename 保存的文件名
 * @param answer_list 答案列表
 * @return {void}
 */
export default function(img_list, filename, answer_list){
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
        }
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