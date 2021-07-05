// ==UserScript==
// @name         [local-develop-api] Rain Classroom PDF Direct Download
// @name:zh-CN   [本地开发接口] 雨课堂课件PDF下载工具
// @namespace    https://www.pizyds.com/
// @version      1.0.1
// @description  [local-develop-api] Automatic generation of direct download PDF on Rain Classroom
// @description:zh-CN [本地开发接口] 在雨课堂页面自动生成PDF版本课件提供下载
// @author       PillarsZhang
// @homepage     https://www.pizyds.com/rain-classroom-pdf-direct-download
// @supportURL   https://www.pizyds.com/rain-classroom-pdf-direct-download
// @license      MIT
// @match        https://*.yuketang.cn/*
// @icon         https://www.yuketang.cn/static/images/favicon.ico
// ==/UserScript==

(function() {
  'use strict';
  console.log('[本地开发接口] 雨课堂课件PDF下载工具：已载入');
  var scriptUrl = "https://localhost:8081/Rain%20Classroom%20PDF%20Direct%20Download.user.js";
  fetch(scriptUrl)
    .then(response => response.text())
    .then(text => eval(text)) //eslint-disable-line no-eval
    .catch(err => console.error(err));
  //输入 npm test 以进行本地测试
})()