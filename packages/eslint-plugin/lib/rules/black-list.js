const { MESSAGES_OBJ, MESSAGES_IDS } = require("../utils/message-ids");
const blackList = require("../utils/base-config").blackList;
/**
 * eslint自定义插件，一些配置的黑名单内容 如六马接口等
 * @type {{meta: {}, create: exports.create}}
 */
module.exports = {
  meta: {
    docs: {
      description: "黑名单",
      category: "Possible Errors",
      recommended: true,
    },
    messages: {
      ...MESSAGES_OBJ,
    },
  },
  create: function (context) {
    function isUrl(str) {
      return /^(https?:)?\/\/.*/.test(str);
    }
    function checkBlackList(node) {
      const url = node.value + "";
      if (!isUrl(url)) return;
      if (blackList.some((item) => url.indexOf(item) > -1)) {
        context.report({
          node,
          messageId: MESSAGES_IDS.BLACK_COMMON.id,
          data: {
            name: url,
          },
        });
      }
    }
    return {
      Literal: checkBlackList,
    };
  },
};
