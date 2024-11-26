const utils = require("../utils");
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "限制.vue文件中的template中的v-if、v-bind、v-show的变量访问深度不超过3层",
      category: "Best Practices",
      recommended: true,
    },
    fixable: null,
  },

  create: function (context) {
    const MAX_DEPTH = context.options[0] || 3;
    function isForbidden(node) {
      const isMemberExpression = node.type === "MemberExpression";
      const isComputedMemberExpression = node.computed;
      const depth = isMemberExpression ? 1 + getDepth(node.object) : 0;

      return {
        result:
          isMemberExpression &&
          !isComputedMemberExpression &&
          depth >= MAX_DEPTH,
        depth,
      };
    }

    function getDepth(node) {
      if (!node) return 0;
      if (node.type === "MemberExpression") {
        return 1 + getDepth(node.object);
      }
      return 0;
    }

    return utils.defineTemplateBodyVisitor(context, {
      /**
       * @param {VElement} node
       */
      "VAttribute[directive=true]"(node) {
        if (!utils.isBuiltInDirectiveName(node.key.name.name)) return;
        // 只处理MemberExpression即对象字面量 不处理LogicalExpression表达式
        if (node.value && node.value.expression) {
          const expresssionResult = isForbidden(node.value.expression);
          if (expresssionResult.result) {
            context.report({
              node: node,
              message: `The variable access of v-${node.key.name.name} is limited to ${MAX_DEPTH} layers, now is ${expresssionResult.depth} layers. It is required to use computed properties and ensure data compatibility`,
            });
          }
        }
      },
    });
  },
};
