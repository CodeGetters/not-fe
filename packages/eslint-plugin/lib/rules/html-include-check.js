const path = require("path");
const { MESSAGES_OBJ, MESSAGES_IDS } = require("../utils/message-ids");

/**
 * 禁止本地进行ua判断 统一使用util工具中的方法
 * @type {{meta: {}, create: exports.create}}
 */

module.exports = {
  meta: {
    docs: {
      description: "include语法检查",
      category: "Possible Errors",
      recommended: true,
    },
    messages: {
      ...MESSAGES_OBJ,
    },
  },
  create: function (context) {
    function isInclude(value) {
      return /^(?=.*#)(?=.*include)(?=.*virtual)(?=.*=).*$/.test(value);
    }

    function checkInclude(node) {
      if (
        !node.open ||
        node.open.value !== "<!--" ||
        !node.value ||
        !isInclude(node.value.value)
      )
        return;
      const includeContent = node.value.value;
      if (isInclude(includeContent)) {
        if (!/^#include\svirtual=\"\/.*\.html\"$/.test(includeContent)) {
          context.report({
            node,
            messageId: MESSAGES_IDS.HTML_INCLUDE_SYNTAX_ERROR.id,
          });
          return;
        }
        if (/^#include\svirtual=\"\/branch_.*\.html\"$/.test(includeContent)) {
          context.report({
            node,
            messageId: MESSAGES_IDS.HTML_INCLUDE_NO_BRANCH.id,
          });
        }
      }
    }

    return {
      Comment: checkInclude,
    };
  },
};
