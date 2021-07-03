/**
 * PPT HTML Class 标注（针对发布的“课件”类型）
 * @param el_dialog 整体 dialog DOM 对象
 * @return {Boolean}
 */
export default function get_html_slides(el_dialog){
    try{
        var el_swiper = el_dialog.getElementsByClassName("pptSwiper")[0];
        var el_slides = el_swiper.getElementsByClassName("swiper-slide");
        for (let i = 0; i < el_slides.length; i++){
            el_slides[i].classList.add("pizyds_el_slide");
            el_slides[i].getElementsByClassName("courseware heightPriority")[0].classList.add("pizyds_el_ppt");
        }
        console.log(`雨课堂课件PDF下载工具：提取到 ${el_slides.length} 页 PPT`);
        return true;
    } catch(err){
        console.error(err);
        return false;
    }
}