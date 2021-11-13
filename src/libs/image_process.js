import { refreshProcessStatus, refreshHeaderMessage, url2ImgData } from "./public.js";

/**
 * 借助Canvas，进行图片下载与并转化为ImageData(RGBAData)
 * @param url_slides 图片链接列表
 * @return {Promise}
 */
export default function (url_slides){
    var promiseList = new Array(url_slides.length);
    var finished_num = 0;
    var count_finished_num = (index) => {
        var processStatus = `${++finished_num}/${url_slides.length}`;
        refreshProcessStatus(`处理图片(${processStatus})`);
        console.log(`雨课堂课件PDF下载工具：${processStatus} - 第${index+1}页 - ${url_slides[index]}`);
    }
    for (let i = 0; i < url_slides.length; i++){
        promiseList[i] = url2ImgData(url_slides[i]).then(ImageData => {
            count_finished_num(i);
            return ImageData;
        }).catch(err => {
            console.error(err);
            refreshProcessStatus(false);
            refreshHeaderMessage(`图像处理出错（第${i+1}页：${url_slides[i]}）`, 'Warn');
            throw err;
        });
    }
    return Promise.all(promiseList);
}