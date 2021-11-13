import ejs_conf_panel from "../ejs/ejs_pizyds_rain_conf_panel.ejs";
import ejs_conf_title from "../ejs/ejs_pizyds_rain_conf_title.ejs";
import ejs from "ejs/ejs.js"
import 'bootstrap/js/dist/popover';
import { build_info, ans_config, drm_config, time_object } from "./common";
import { adjustSVGSize, judgeVersionUpdate, textVersionUpdate, clearVersionUpdate, getHeaderMessage, refreshHeaderMessage } from "./public";
import '../styles/css_pizyds_rain.scss';
import default_svg from 'bootstrap-icons/icons/arrow-return-left.svg'
import github_svg from 'bootstrap-icons/icons/github.svg'
import house_svg from 'bootstrap-icons/icons/house.svg'
import code_svg from 'bootstrap-icons/icons/code-slash.svg'
import $ from "jquery";

/**
 * 悬浮窗注入
 * @param {Element} buttonEle 需要注入悬浮窗的按钮
 * @return {void}
 */
export default function(buttonEle){
    var form_templ = ejs_conf_panel;
    var form_html = () => ejs.render(form_templ, {
        BUILD_VERSION: build_info.version,
        BUILD_TIME: formatDate(new Date(build_info.timestamp)),
        ANS_ENABLED: ans_config.enabled,
        DRM_ENABLED: drm_config.enabled,
        FONT_SIZE: ans_config.fontSize,
        HEADER_MESSAGE: getHeaderMessage(),
        DEFAULT_SVG: adjustSVGSize(default_svg, 12),
        HOUSE_SVG: adjustSVGSize(house_svg, 12),
        GITHUB_SVG: adjustSVGSize(github_svg, 12),
        CODE_SVG: adjustSVGSize(code_svg, 12)
    });
    var container = $(".pizyds_rain")[0];
    $(container).off();

    // eslint-disable-next-line no-unused-vars
    $(buttonEle).popover({
        title: ejs.render(ejs_conf_title),
        container,
        content: form_html,
        html: true,
        sanitize: false,
        placement: "bottom",
        customClass: "pizyds_rain_conf_popover",
        trigger: "click",
        offset: [-80, 8]
    })

    $("html").off();
    $("html").on('click', function (e) {
        var popoverEle = $('.pizyds_rain_conf_popover')[0];
        if (
          time_object.popover_can_hide < Date.now() && 
          popoverEle && 
          !$(buttonEle).is(e.target) && 
          $(buttonEle).has(e.target).length == 0 && 
          !$(popoverEle).is(e.target) && 
          $(popoverEle).has(e.target).length == 0
        ) {
            $(popoverEle).popover('hide');
        }
    });

    $(container).on('input change', "#pizyds_rain_answer_font_size_range", function(){
        $("#pizyds_rain_answer_font_size_show").html(this.value);
    })

    $(container).on('change', "#pizyds_rain_answer_font_size_range", function(){
        ans_config.fontSize = this.value;
    })

    $(container).on('change', "#pizyds_rain_answer_switch", function(){
        ans_config.enabled = this.checked;
        if (!ans_config.enabled) {
            $("#pizyds_rain_answer_font_size_field")
              .addClass("disabledField")
              .find('input')
              .attr('disabled', '');
        } else{
            $("#pizyds_rain_answer_font_size_field")
              .removeClass("disabledField")
              .find('input')
              .removeAttr('disabled');
        }
    })

    $(container).on('click', "#pizyds_rain_answer_font_size_default", function(){
        $("#pizyds_rain_answer_font_size_range")
          .prop("value", ans_config.$fontSize)
          .trigger("change");
    })

    $(container).on('change', "#pizyds_rain_drm_switch", function(){
        drm_config.enabled = this.checked;
    })

    //更新提示
    if (judgeVersionUpdate()){
        refreshHeaderMessage(textVersionUpdate[judgeVersionUpdate()]);
        clearVersionUpdate();
    }
}

/**
 * Date对象转yyyy-MM-dd
 * @param {Date} date Date对象
 * @return {string} yyyy-MM-dd
 */
function formatDate(date){
	var yyyy = (date.getFullYear()).toString().padStart(4, "0");
    var MM = (date.getMonth()+1).toString().padStart(2, "0");
    var dd = (date.getDate()).toString().padStart(2, "0");
	return [yyyy, MM, dd].join('-')
}
