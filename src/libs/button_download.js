import icon_download_svg from 'bootstrap-icons/icons/file-earmark-pdf.svg';
import icon_config_svg from 'bootstrap-icons/icons/gear-fill.svg';
import { adjustSVGSize } from './public.js';
import conf_panel from './conf_panel';
import download_process from './download_process.js';
import ejs_pizyds_rain_download_button from '../ejs/ejs_pizyds_rain_download_button.ejs';
import ejs from "ejs/ejs.js"
import $ from 'jquery';

/**
 * 按钮注入
 * @param el_dialog 整体 dialog DOM 对象
 * @param url_type URL 类型
 * @return {void}
 */
export default function button_download(el_dialog, url_type = 1){
    if (!data_on_type[url_type]){
        console.log(`雨课堂课件PDF下载工具：按钮注入未知错误 - type ${url_type}`);
        return false;
    }
    var el_header = header_on_type[url_type](el_dialog);
    if (!el_header){
        console.log(`雨课堂课件PDF下载工具：layout header 查找失败`);
        return false;
    }
    if ($(el_header).find("#pizyds_rain_button_field").length == 0){
        try {
            $(el_dialog).addClass("pizyds_rain"); //自定义CSS启用的条件
            var template = ejs.compile(ejs_pizyds_rain_download_button);
            var data = Object.assign(data_on_type["base"], data_on_type[url_type]);
            var html = template(data);
            $(el_header).find(`.${data.CLASS}`).first().before(html);
            $("#pizyds_rain_download_button").off();
            $("#pizyds_rain_download_button").on("click", () => download_process(el_dialog, url_type));
            conf_panel($("#pizyds_rain_config_button"));
            console.log(`雨课堂课件PDF下载工具：按钮注入成功 - type ${url_type}`);
        } catch (err) {
            return false;
        }
    }
    return true;
}

var data_on_type = {
    base: {
        CLASS: "",
        FIELD_CLASS: "",
        DOWNLOAD_BUTTON_ICON: adjustSVGSize(icon_download_svg, 14),
        CONFIG_BUTTON_ICON: adjustSVGSize(icon_config_svg, 14)
    },
    1: {
        CLASS: "print",
        FIELD_CLASS: "pizyds_rain_button_field_type_1",
    },
    2: {
        CLASS: "button"
    }
}

var header_on_type = {
    1: (el_dialog) => $(el_dialog).find(".layout_header").first(),
    2: (el_dialog) => $(el_dialog).find(".layout-header").first()
}