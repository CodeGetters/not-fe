module.exports = {
  meta: {
    docs: {
      description: "while loop is forbidden",
      recommended: true,
    },
    fixable: null, // 修复函数
  },
  create: function (context) {
    return {
      // 返回事件钩子
      WhileStatement: function (node) {
        context.report(node, "while loop is forbidden");
      },
    };
  },
};
