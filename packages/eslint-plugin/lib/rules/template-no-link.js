const utils = require("../utils");
const { MESSAGES_OBJ } = require("../utils/message-ids");
module.exports = {
  meta: {
    docs: {
      description: "手游下载地址限制，禁止使用gdl链接",
      category: "Possible Errors",
      recommended: true,
    },
    messages: {
      ...MESSAGES_OBJ,
    },
  },

  create: function (context) {
    return utils.defineTemplateBodyVisitor(context, {
      /**
       * @param {VElement} node
       */
      "VAttribute[directive=false]"(node) {
        // 只处理MemberExpression即对象字面量 不处理LogicalExpression表达式
        if (node.value && node.value.type === "VLiteral" && node.value.value) {
          utils.isAllowLink(context, node, node.value.value);
        }
      },
      TemplateElement(node) {
        // vue template中的模版字符串
        if (node.value && node.value.raw && node.value.raw.length > 0) {
          utils.isAllowLink(context, node, node.value.raw);
        }
      },
    });
  },
};
