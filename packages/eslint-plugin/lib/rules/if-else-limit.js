module.exports = {
  meta: {
    docs: {
      description: "if-else-limit",
      recommended: true, //  是否通过 "extends": "eslint:recommended"属性启用该规则。
    },
    fixable: null, // 修复函数
  },
  create: function (context) {
    const limit = context.options[0] || 5;

    function checkNode(node, depth = 1) {
      const parent = node.parent;
      if (parent.type === "BlockStatement" && node.type === "IfStatement") {
        // 确保是第一层if statement
        checkDepth(node, depth);
      }
    }

    function checkDepth(node, depth) {
      if (depth >= limit) {
        context.report(
          node,
          `Too many if else statements, no more than ${limit}, use switch or return in advance`,
        );
      } else {
        if (node.alternate) {
          checkDepth(node.alternate, depth + 1);
        }
      }
    }
    return {
      IfStatement: checkNode,
    };
  },
};
