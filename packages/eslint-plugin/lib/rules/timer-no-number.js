module.exports = {
  meta: {
    docs: {
      description:
        "setTimeout,setInterval,the second parameter prohibits a magic numbers, please use meaningful variables",
      recommended: true, //  是否通过 "extends": "eslint:recommended"属性启用该规则。
    },
    fixable: null, // 修复函数
  },
  create: function (context) {
    return {
      // 返回事件钩子
      CallExpression: (node) => {
        if (
          node.callee.name !== "setTimeout" &&
          node.callee.name !== "setInterval"
        )
          return; // 不是定时器即过滤
        const timeNode = node.arguments && node.arguments[1];
        if (!timeNode) return;
        if (timeNode.type === "Literal" && typeof timeNode.value === "number") {
          context.report({
            node,
            message:
              "setTimeout,setInterval,the second parameter prohibits a magic numbers, please use named variables",
          });
        }
      },
    };
  },
};
