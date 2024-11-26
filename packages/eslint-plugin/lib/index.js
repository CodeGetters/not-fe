/**
 * @fileoverview 自定义eslint插件
 * @author hzxuli
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules

const outputs = {
  rules: requireIndex(__dirname + "/rules"), // 为了方便引入，各个js文件平铺在rules文件夹中
  configs: {
    // 导出自定义规则 在项目中直接引用
    // .vue, .js集合
    recommended: {
      plugins: ["@ccc/leihuo"],
      rules: {
        // 开启规则
        //"off" or 0 - 关闭规则
        // "warn" or 1 - 将规则视为一个警告（不会影响退出码）
        // "error" or 2 - 将规则视为一个错误 (退出码为1)
        "@ccc/leihuo/timer-no-number": "off",
        "@ccc/leihuo/no-local-date": "off",
        "@ccc/leihuo/require-video-audio-source-type": "error",
        "@ccc/leihuo/no-equal-to-magic-number": "error",
        "@ccc/leihuo/template-no-equal-to-magic-number": "error",
        "@ccc/leihuo/template-no-complex-condition": "error",
        "@ccc/leihuo/template-directive-obj-deep-limit": "error",
        "@ccc/leihuo/template-resource-link-limit": "error",
        "@ccc/leihuo/if-else-limit": "error",
        "@ccc/leihuo/no-while-loop": "error",
        "@ccc/leihuo/timer-require-clear": "error",
        "@ccc/leihuo/no-window-api": [
          "error",
          {
            apis: ["localStorage", "sessionStorage"],
          },
        ],
        "@ccc/leihuo/parent-children-limit": "error",
        "@ccc/leihuo/res-code-if-with-else": "error",
        "@ccc/leihuo/new-date-limit": "error",
        "@ccc/leihuo/typo": "error",
        "@ccc/leihuo/template-typo": "error",
        "@ccc/leihuo/api-host-file-limit": "error",
        "@ccc/leihuo/no-ua": "error",
        "@ccc/leihuo/if-index-of-limit": "error",
        "@ccc/leihuo/resource-link-limit": "error",
        "@ccc/leihuo/no-vconsole": "error",
        "@ccc/leihuo/black-list": "error",
        "@ccc/leihuo/no-link": "error",
        "@ccc/leihuo/template-no-link": "error",
      },
    },
    // .html集合
    htmlRecommend: {
      plugins: ["@ccc/leihuo"],
      rules: {
        "@ccc/leihuo/html-no-jump-with-ua": "error",
        "@ccc/leihuo/html-include-check": "error",
        "@ccc/leihuo/html-include-echo-var-check": "error",
        "@ccc/leihuo/html-require-video-audio-source-type": "error",
        "@ccc/leihuo/resource-link-limit": "error",
        "@ccc/leihuo/typo": "error",
        "@ccc/leihuo/no-external-cdn": "error",
        "@ccc/leihuo/no-vconsole": "error",
        "@ccc/leihuo/no-link": "error",
      },
    },
  },
};
module.exports = outputs;
