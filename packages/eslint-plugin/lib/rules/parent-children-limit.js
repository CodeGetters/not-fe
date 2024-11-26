const limitArr = ["$parent", "$children"];
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "限制vue中过于随意的组件通信，如this.$parent.$parent.$children",
      category: "Best Practices",
      recommended: true,
    },
    fixable: null,
  },

  create: function (context) {
    const MAX_DEPTH = context.options[0] || 1;

    function getDepth(node) {
      if (!node) return 0;
      if (node.property && limitArr.includes(node.property.name)) {
        return 1 + getDepth(node.parent);
      }
      return 0;
    }

    return {
      // 返回事件钩子
      MemberExpression: (node) => {
        if (
          node.object.type === "ThisExpression" &&
          node.property &&
          limitArr.includes(node.property.name)
        ) {
          const apiDepth = getDepth(node);
          // console.log(node.property.name)
          // console.log(apiDepth)
          if (apiDepth > MAX_DEPTH) {
            context.report({
              node: node,
              message: `The component communication methods ${limitArr.join(",")} are nested ${apiDepth} layers，no more than ${MAX_DEPTH} layer`,
            });
          }
        }
      },
    };
  },
};
