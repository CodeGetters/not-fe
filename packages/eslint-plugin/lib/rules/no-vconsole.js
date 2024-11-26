/**
 * @type {Rule}
 */
const { MESSAGES_OBJ, MESSAGES_IDS } = require("../utils/message-ids");
module.exports = {
  meta: {
    type: "code",
    docs: {
      description: "禁止开发单独引入vconsole",
      recommended: true, //  是否通过 "extends": "eslint:recommended"属性启用该规则。
    },
    fixable: null,
    messages: {
      ...MESSAGES_OBJ,
    },
  },

  create(context) {
    function NoVconsole(node) {
      if (node && node.callee && node.callee.name === "VConsole") {
        context.report({
          node,
          messageId: MESSAGES_IDS.NO_VCONSOLE.id,
        });
      }
    }

    function htmlNoVconsole(node) {
      if (!node.value) return;
      const scriptContent = node.value.trim().replace(/[\s\t\n\r]+/g, "");
      if (/new(window\.)?VConsole/.test(scriptContent)) {
        context.report({
          node,
          messageId: MESSAGES_IDS.NO_VCONSOLE.id,
        });
      }
    }

    return {
      NewExpression: NoVconsole,
      ScriptTagContent: htmlNoVconsole,
    };
  },
};
