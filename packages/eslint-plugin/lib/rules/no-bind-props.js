module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "In the Vue project, when the multi-layer properties of the object are used in the code, eslint prompts to verify whether the object before the property exists",
      category: "Fill me in",
      recommended: true,
    },
    schema: [
      // fill in your schema
    ],
    messages: {
      avoidMethod: "Get object properties, Make sure {{name}} exists",
    },
  },
  create(context) {
    return {
      'VAttribute[key.name="bind"]'(node) {
        // 获取 bind 的值
        const value = node.value.expression;
        // 如果是对象字面量
        if (value.type === "ObjectExpression") {
          // 检查深度是否超过了3层
          const maxDepth = 3;
          const depth = getMaxDepth(value, 0);
          if (depth > maxDepth) {
            context.report({
              node,
              message: `Vue bind cannot be deeper than ${maxDepth} levels.`,
            });
          }
        }
      },
    };
  },
};

// 获取对象字面量的深度
const getMaxDepth = function (node, depth) {
  if (node.type === "ObjectExpression") {
    return node.properties.reduce((acc, prop) => {
      return Math.max(acc, getMaxDepth(prop.value, depth + 1));
    }, depth);
  } else if (node.type === "ArrayExpression") {
    return node.elements.reduce((acc, el) => {
      return Math.max(acc, getMaxDepth(el, depth + 1));
    }, depth);
  } else {
    return depth;
  }
};
