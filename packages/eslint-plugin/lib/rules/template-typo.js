const utils = require("../utils");
const defaultWords = require("../utils/base-config").defaultWords;
module.exports = {
  meta: {
    docs: {
      description: "detect misspellings in vue template",
      recommended: true, //  是否通过 "extends": "eslint:recommended"属性启用该规则。
    },
    fixable: null, // 修复函数
    schema: [
      {
        type: "object",
        properties: {
          words: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create: function (context) {
    const options = context.options[0] || {};
    const words = { ...defaultWords, ...options.words };

    return utils.defineTemplateBodyVisitor(context, {
      /**
       * @param {VElement} node
       */
      VText(node) {
        utils.checkTypo(context, node, words);
      },
      Literal(node) {
        utils.checkTypo(context, node, words);
      },
    });
  },
};
