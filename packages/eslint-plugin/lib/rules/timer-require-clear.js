module.exports = {
  meta: {
    docs: {
      description: "clear timer",
      recommended: true,
    },
    fixable: null,
  },
  create: function (context) {
    const timerStack = [];
    const interValStack = [];

    function add(type, node) {
      if (type === "setTimeout") {
        timerStack.push({ node, type: "timeout" });
      } else {
        interValStack.push({ node, type: "interval" });
      }
    }
    return {
      CallExpression: function (node) {
        const name = node.callee.name;
        if (name === "setTimeout" || name === "setInterval") {
          add(name, node);
        } else if (name === "clearTimeout") {
          const timer = timerStack.pop();
          if (!timer || timer.type !== "timeout") {
            context.report({
              node,
              message: "clearTimeout called without a corresponding setTimeout",
            });
          }
        } else if (name === "clearInterval") {
          const timer = interValStack.pop();
          if (!timer || timer.type !== "interval") {
            context.report({
              node,
              message:
                "clearInterval called without a corresponding setInterval",
            });
          }
        }
      },

      "Program:exit": function () {
        if (timerStack.length > 0) {
          const timer = timerStack.pop();
          context.report({
            node: timer.node,
            message: "uncleared timer,use clearTimeout",
          });
        }
        if (interValStack.length > 0) {
          const timer = interValStack.pop();
          context.report({
            node: timer.node,
            message: "uncleared timer,use clearInterval",
          });
        }
      },
    };
  },
};
