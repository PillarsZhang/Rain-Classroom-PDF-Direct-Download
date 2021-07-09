import ejs_conf_panel from "../ejs/ejs_pizyds_rain_conf_panel.ejs";
import ejs from "ejs/ejs.js"
import Popover from 'bootstrap/js/dist/popover';
import { build_info, ans_config, drm_config } from "./common";
import '../styles/css_pizyds_rain.scss';
import $ from "jquery";    console.log(window);

export default function(buttonEle){
    var form_templ = ejs_conf_panel;
    var form_html = ejs.render(form_templ, {
        BUILD_VERSION: build_info.version,
        BUILD_TIME: formatDate(new Date(build_info.timestamp)),
        ANS_ENABLED: ans_config.enabled,
        DRM_ENABLED: drm_config.enabled,
        FONT_SIZE: ans_config.fontSize
    });
    var popoverIns = new Popover(buttonEle, {
        title: "雨课堂课件PDF下载工具",
        container: $(".basePPTDialog")[0],
        content: form_html,
        html: true,
        sanitize: false,
        placement: "bottom",
        customClass: "pizyds_rain_conf_popover",
        trigger: "click",
        offset: [-80, 8]
    })

    popoverIns.show();

    $("html").on('click', function (e) {
        var popoverEle = $('.pizyds_rain_conf_popover')[0];
        if (popoverEle && !$(buttonEle).is(e.target) && $(buttonEle).has(e.target).length == 0 && !$(popoverEle).is(e.target) && $(popoverEle).has(e.target).length == 0) {
            $(popoverEle).popover('hide');
        }
    });

    $("body").on('input', "#pizyds_rain_answer_font_size", function(){
        $("#pizyds_rain_answer_font_size_show").html(this.value);
    })

    $("body").on('change', "#pizyds_rain_answer_switch", function(){
        if(this.checked){
            console.log("answer_on");
        } else{
            console.log("answer_off");
        }
    })
    $("body").on('change', "#pizyds_rain_drm_switch", function(){
        if(this.checked){
            console.log("drm_on");
        } else{
            console.log("drm_off");
        }
    })
}

function formatDate(date){
	var yyyy = (date.getFullYear()).toString().padStart(4, "0");
    var MM = (date.getMonth()+1).toString().padStart(2, "0");
    var dd = (date.getDate()).toString().padStart(2, "0");
	return [yyyy, MM, dd].join('-')
}