const path = require("path");
/**
 * 禁止本地进行ua判断 统一使用util工具中的方法
 * @type {{meta: {}, create: exports.create}}
 */

module.exports = {
  meta: {
    docs: {
      description: "禁止本地进行ua判断 统一使用util工具中的方法",
      category: "Possible Errors",
      recommended: true,
    },
  },
  create: function (context) {
    function checkUserAgent(node) {
      if (node.name !== "userAgent") return;
      const parent = node.parent;
      if (
        parent.type === "MemberExpression" &&
        parent.object.type === "Identifier" &&
        parent.object.name === "navigator"
      ) {
        context.report({
          node,
          message: `禁止本地进行ua判断,统一使用leihuo-util工具中的方法(https://ccc-doc.leihuo.netease.com/#/doc/leihuo-util/#/)，若不支持，请联系导师添加`,
        });
      }
    }

    return {
      Identifier: checkUserAgent,
    };
  },
};
