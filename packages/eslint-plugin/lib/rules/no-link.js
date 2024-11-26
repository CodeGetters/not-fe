const { MESSAGES_OBJ, MESSAGES_IDS } = require("../utils/message-ids");
const utils = require("../utils");
/**
 * eslint自定义插件
 * @type {{meta: {}, create: exports.create}}
 */
module.exports = {
  meta: {
    docs: {
      description:
        "手游下载地址限制，禁止使用gdl链接。且禁止使用nie.v.netease.com的视频资源地址",
      category: "Possible Errors",
      recommended: true,
    },
    messages: {
      ...MESSAGES_OBJ,
    },
  },
  create: function (context) {
    function checkDownloadLink(node) {
      const url = node.value + "";
      utils.isAllowLink(context, node, url);
    }
    function checkTemplate(node) {
      if (node.value && node.value.raw && node.value.raw.length > 0) {
        utils.isAllowLink(context, node, node.value.raw);
      }
    }

    return {
      Literal: checkDownloadLink,
      AttributeValue: checkDownloadLink, // .html
      TemplateElement: checkTemplate, // 模版字符串
    };
  },
};
