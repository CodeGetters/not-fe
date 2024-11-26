const utils = require("../utils");
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "限制.vue文件中的template中的v-if、v-show的条件表达式不要过于长，涵盖逻辑表达式和对象属性访问",
      category: "Best Practices",
      recommended: true,
    },
    fixable: null,
  },

  create: function (context) {
    const MAX_DEPTH = context.options[0] || 100;

    /**
     *   <p v-if="test === 1 && a.b.d.e === 134">{{ test }}</p>
     *   test === 1 && a.b.d.e === 134
     *   会最终解析到type为Identifier 或者Literal等，算深度为1
     *   所以上述例子 最终解析成
     *   test
     *   1
     *   a.b.d.e为三层属性，算作3
     *   134
     *   所以总共为6层
     * @param node
     * @returns {number|*}
     */
    function getComplexity(node) {
      if (node.type === "LogicalExpression") {
        const leftComplexity = getComplexity(node.left);
        const rightComplexity = getComplexity(node.right);
        return leftComplexity + rightComplexity;
      } else if (node.type === "BinaryExpression") {
        const leftComplexity = getComplexity(node.left);
        const rightComplexity = getComplexity(node.right);
        return leftComplexity + rightComplexity;
      } else if (node.type === "ConditionalExpression") {
        const testComplexity = getComplexity(node.test);
        const consequentComplexity = getComplexity(node.consequent);
        const alternateComplexity = getComplexity(node.alternate);
        return testComplexity + consequentComplexity + alternateComplexity;
      } else if (node.type === "MemberExpression") {
        const propertyComplexity = getComplexity(node.property);
        if (node.object.type === "MemberExpression") {
          // 对象字面量属性深度
          const objectComplexity = getComplexity(node.object);
          return objectComplexity + propertyComplexity;
        } else {
          return propertyComplexity;
        }
      } else {
        return 1;
      }
    }

    return utils.defineTemplateBodyVisitor(context, {
      /**
       * @param {VElement} node
       */
      'VAttribute[directive=true][key.name.name="if"], VAttribute[directive=true][key.name.name="show"]'(
        node,
      ) {
        const expression = node.value.expression;
        const complexity = getComplexity(expression);
        if (complexity > MAX_DEPTH) {
          context.report({
            node,
            message: `The complexity of this condition is too high (${complexity}). Use computed instead`,
          });
        }
      },
    });
  },
};
