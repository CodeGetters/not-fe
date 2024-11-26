const path = require("path");
/**
 * 禁止本地进行ua判断 统一使用util工具中的方法
 * @type {{meta: {}, create: exports.create}}
 */

module.exports = {
  meta: {
    docs: {
      description: "SSI echo var语法检查",
      category: "Possible Errors",
      recommended: true,
    },
  },
  create: function (context) {
    function isEchoVar(value) {
      // # echo var = 'xxx'
      return /^(?=.*#)(?=.*echo)(?=.*var)(?=.*=).*$/.test(value);
    }

    function isEchoVarAttribute(value) {
      // <!--#echo var='xxx'-->
      return /^<!--(?=.*#)(?=.*echo)(?=.*var)(?=.*=).*-->.*$/.test(value);
    }

    function checkEchoVar(node) {
      if (
        !node.open ||
        node.open.value !== "<!--" ||
        !node.value ||
        !isEchoVar(node.value.value)
      )
        return;
      const includeContent = node.value.value;
      if (
        isEchoVar(includeContent) &&
        !/^#echo\s+var=['"].*['"]$/.test(includeContent)
      ) {
        context.report({
          node,
          message: `SSI echo var语法错误，请注意空格，严格按照此格式<!--#echo var='xxx'-->`,
        });
      }
    }

    function checkAttributeEchoVar(node) {
      if (!node.value || !isEchoVarAttribute(node.value.value)) return;
      if (!/^<!--#echo\s+var=['"].*['"]-->$/.test(node.value.value)) {
        context.report({
          node,
          message: `属性中的SSI echo语法错误，请注意空格，严格按照此格式，如<a href="<!--#echo var='Download'-->"></a>`,
        });
      }
    }

    return {
      Comment: checkEchoVar,
      Attribute: checkAttributeEchoVar,
    };
  },
};
