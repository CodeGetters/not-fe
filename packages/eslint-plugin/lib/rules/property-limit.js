module.exports = {
  meta: {
    docs: {
      description: "limit object property access in vue template bindings",
      category: "Possible Errors",
      recommended: true,
    },
    schema: [], // no options
  },
  create: function (context) {
    function checkExpression(expression) {
      if (
        expression.type === "MemberExpression" &&
        expression.object.type === "MemberExpression" &&
        expression.property.type === "Identifier"
      ) {
        const propertyChain = [expression.property.name];
        let currentObject = expression.object;
        while (currentObject.type === "MemberExpression") {
          if (currentObject.property.type === "Identifier") {
            propertyChain.unshift(currentObject.property.name);
            currentObject = currentObject.object;
          } else {
            break;
          }
        }
        if (currentObject.type === "Identifier") {
          propertyChain.unshift(currentObject.name);
        }
        if (propertyChain.length > 3) {
          context.report({
            node: expression.property,
            message: "Object property access should not exceed 3 levels",
          });
        }
      }
    }
    return {
      "VForExpression > AssignmentExpression.left": checkExpression,
      "VIfExpression > AssignmentExpression.left": checkExpression,
      VBindKeyExpression: checkExpression,
    };
  },
};
