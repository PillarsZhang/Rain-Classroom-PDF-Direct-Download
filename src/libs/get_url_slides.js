/**
 * PPT图片链接提取
 * @param {HTMLElement} el_dialog 整体 dialog DOM 对象
 * @return {Array} 链接列表
 */
export default function get_url_slides(el_dialog){
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