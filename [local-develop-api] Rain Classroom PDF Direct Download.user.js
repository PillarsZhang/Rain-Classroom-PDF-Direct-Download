/* globals jspdf UPNG html2canvas */

// ==UserScript==
// @name         [local-develop-api] Rain Classroom PDF Direct Download
// @name:zh-CN   [本地开发接口] 雨课堂课件PDF下载工具
// @namespace    https://www.pizyds.com/
// @version      1.0.0
// @description  [local-develop-api] Automatic generation of direct download PDF on Rain Classroom
// @description:zh-CN [本地开发接口] 在雨课堂页面自动生成PDF版本课件提供下载
// @author       PillarsZhang
// @homepage     https://www.pizyds.com/rain-classroom-pdf-direct-download
// @supportURL   https://www.pizyds.com/rain-classroom-pdf-direct-download
// @license      MIT
// @match        https://*.yuketang.cn/*
// @icon         https://www.yuketang.cn/static/images/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.3.1/jspdf.umd.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/pako/2.0.3/pako.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/upng-js/2.1.0/UPNG.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.5.0-beta4/html2canvas.js
// @resource     pizyds_iconfont_css https://at.alicdn.com/t/font_2448118_l5d66dc50k9.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// ==/UserScript==

(function() {
  'use strict';
  console.log('[本地开发接口] 雨课堂课件PDF下载工具：已载入');
  var scriptUrl = "http://127.0.0.1:8081/Rain%20Classroom%20PDF%20Direct%20Download.user.js";
  fetch(scriptUrl)
    .then(response => response.text())
    .then(text => eval(text)) //eslint-disable-line no-eval
    .catch(err => console.error(err));
  //输入 npm test 以进行本地测试
})()