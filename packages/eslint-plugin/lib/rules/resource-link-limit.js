/**
 * @type {Rule}
 */
const utils = require("../utils");
const { MESSAGES_OBJ, MESSAGES_IDS } = require("../utils/message-ids");
module.exports = {
  meta: {
    type: "code",
    docs: {
      description:
        "资源地址必须使用https,且前后不能有空格，空格存在真机兼容性问题",
      recommended: true, //  是否通过 "extends": "eslint:recommended"属性启用该规则。
    },
    fixable: null,
    messages: {
      ...MESSAGES_OBJ,
    },
  },

  create(context) {
    function check(node) {
      if (
        node &&
        utils.containChinese(node.value) &&
        node.parent.type === "CallExpression" &&
        node.parent.callee.type === "Identifier" &&
        node.parent.callee.name === "require"
      ) {
        // require检测
        return context.report({
          node,
          messageId: MESSAGES_IDS.IMPORT_NO_CHINESE.id,
        });
      }
      utils.checkResourceLink(context, node, node.value);
    }

    function checkTemplateElement(node) {
      if (node.value && node.value.raw && node.value.raw.length > 0) {
        utils.checkResourceLink(context, node, node.value.raw, true);
      }
    }

    function checkImportChinese(node) {
      const sourceValue = node.source.value;
      if (utils.containChinese(sourceValue)) {
        context.report({
          node,
          messageId: MESSAGES_IDS.IMPORT_NO_CHINESE.id,
        });
      }
    }

    return {
      Literal: check, // require这里会检测
      AttributeValue: check, // .html
      TemplateElement: checkTemplateElement, // 模版字符串
      ImportDeclaration: checkImportChinese,
    };
  },
};
