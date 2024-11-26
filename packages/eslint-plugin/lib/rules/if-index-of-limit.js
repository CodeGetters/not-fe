module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "请注意检查indexOf索引，存在-1的情况",
      category: "Best Practices",
      recommended: true,
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    return {
      Identifier(node) {
        if (node.name !== "indexOf") return;
        if (node.parent.type !== "MemberExpression") return;
        if (node.parent.parent.type !== "CallExpression") return;
        if (node.parent.parent.parent.type === "IfStatement") {
          context.report({
            node,
            message: 'indexOf索引使用错误，if(xx.indexOf("x") > -1)',
          });
        }
      },
    };
  },
};
