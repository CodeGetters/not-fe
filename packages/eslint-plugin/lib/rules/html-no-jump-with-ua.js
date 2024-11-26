const path = require("path");
/**
 * 禁止本地通过ua判断进行端型跳转
 * @type {{meta: {}, create: exports.create}}
 */

module.exports = {
  meta: {
    docs: {
      description: "禁止本地在html中出现通过ua进行跳转的代码",
      category: "Possible Errors",
      recommended: true,
    },
  },
  create: function (context) {
    function checkUserAgentJump(node) {
      if (!node.value || node.value.type !== "ScriptTagContent") return;
      const scriptContent = node.value.value.trim().replace(/[\s\t\n\r]+/g, "");
      if (
        /if\(.*navigator\.userAgent.*\)\{(window\.)?location\.href=.*/.test(
          scriptContent,
        )
      ) {
        context.report({
          node,
          message: `禁止本地使用ua进行跳转，请在ccc.config.js配置jumpLoader`,
        });
      }
    }

    return {
      ScriptTag: checkUserAgentJump,
    };
  },
};
