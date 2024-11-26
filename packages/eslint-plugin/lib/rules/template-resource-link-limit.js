const utils = require("../utils");
const { MESSAGES_OBJ } = require("../utils/message-ids");
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "资源地址必须使用https,且前后不能有空格，空格存在真机兼容性问题",
      recommended: true, //  是否通过 "extends": "eslint:recommended"属性启用该规则。
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
          utils.checkResourceLink(context, node, node.value.value);
        }
      },
      TemplateElement(node) {
        // vue template中的模版字符串
        if (node.value && node.value.raw && node.value.raw.length > 0) {
          utils.checkResourceLink(context, node, node.value.raw, true);
        }
      },
    });
  },
};
