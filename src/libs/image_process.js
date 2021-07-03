import { refreshProcessStatus } from "./public.js";
import UPNG from "upng-js";

/**
 * 借助UPNG，进行图片下载与反交错、压缩处理
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