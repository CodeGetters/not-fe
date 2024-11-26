module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "禁止使用本地时间",
      category: "Best Practices",
      recommended: true,
    },
  },
  create(context) {
    return {
      NewExpression(node) {
        if (node.callee.name === "Date") {
          context.report({
            node,
            message: `No local time, use server time instead`,
          });
        }
      },
    };
  },
};
