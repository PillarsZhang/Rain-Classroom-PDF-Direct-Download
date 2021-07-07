import { jsPDF } from 'jspdf';
import { text2img } from './public.js';
import { ans_config, drm_config } from './common.js';
import { generateUserID } from './rsa_drm.js';

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
    injectXMP(doc, [img_list[0].width, img_list[0].height]);
    addPPT(0, doc, img_list, answer_list);
    for (let i = 1; i < img_list.length; i++){
        doc.addPage([img_list[i].width, img_list[i].height], "landscape");
        addPPT(i, doc, img_list, answer_list);
    }
    console.groupEnd();
    doc.save(filename);
    console.log(`雨课堂课件PDF下载工具：完成下载`);
    console.log(`雨课堂课件PDF下载工具：https://www.pizyds.com/rain-classroom-pdf-direct-download/`);
}

function addPPT(index, doc, img_list, answer_list){
    console.log(`雨课堂课件PDF下载工具：第 ${index+1} 页 - PPT`);
    doc.addImage(img_list[index].unit8, 'PNG', 0, 0, img_list[index].width, img_list[index].height, '', 'FAST');
    if (ans_config.enabled){
        let answer_item = answer_list.find(obj => obj.index == index);
        if (answer_item && answer_item.ans != "") {
            let answer_img = text2img(answer_item.ans, ans_config.fontSize, ans_config.fontColor);
            console.log(`雨课堂课件PDF下载工具：第 ${index+1} 页 - 答案 - ${answer_item.ans}`);
            doc.addImage(answer_img.data, 'PNG', img_list[index].width - answer_img.width - ans_config.right,
                            ans_config.up, answer_img.width, answer_img.height, '', 'FAST');
        }
    }
}

function injectXMP(doc, size){
    if (drm_config.enabled){
        console.log(`雨课堂课件PDF下载工具：注入数字版权信息`);
        var userID = generateUserID();
        var drmURL = "https://www.pizyds.com/rain-classroom-pdf-direct-download-pizyds-rain-drm/"
        doc.addMetadata(userID, drmURL);
        var drm_explain = `This file is automatically generated by the tampermonkey script "Rain Classroom PDF Direct Download", ` +
        `and injected with DRM information through RSA+AES hybrid encryption. Please respect the copyright of the PPT publisher.\n\n` +
        `For detailed information, please refer to:\n${drmURL}\n\nDRM information:`;
        doc.text(size[1]*0.1, size[1]*0.1, [drm_explain, userID], { baseline: "top", maxWidth: 1000});
    }
}