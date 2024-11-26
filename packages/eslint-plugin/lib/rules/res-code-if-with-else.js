const CODE_KEY_WORD = "code";
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "处理后台接口返回，如果有code === 1的if，else if必须要有else,防止code处理不完整",
      category: "Best Practices",
      recommended: true,
    },
    fixable: null,
  },

  create: function (context) {
    function withApiResCode(node) {
      const test = node.test;
      const left = node.test.left;
      const right = node.test.right;
      return (
        test.type === "BinaryExpression" &&
        test.operator === "===" &&
        left.type === "MemberExpression" &&
        left.property.type === "Identifier" &&
        left.property.name === CODE_KEY_WORD &&
        (right.type === "Literal" ||
          right.type === "MemberExpression" ||
          right.type === "Identifier")
      );
    }

    const validLastStatementType = [
      "ReturnStatement",
      "ThrowStatement",
      "BreakStatement",
      "ContinueStatement",
      "DebuggerStatement",
    ];

    function checkIfStatement(node) {
      const consequent = node.consequent;
      if (consequent.type === "BlockStatement" && consequent.body.length > 0) {
        const lastStatement = consequent.body[consequent.body.length - 1];
        const type = lastStatement.type;
        if (
          !validLastStatementType.includes(type) &&
          (!node.alternate || node.alternate.type !== "BlockStatement")
        ) {
          if (node.alternate && node.alternate.type === "IfStatement") {
            checkIfStatement(node.alternate);
          } else {
            context.report({
              node: node,
              message: "Missing else statement when handling API response code",
            });
          }
        }
      }
    }

    return {
      IfStatement: function (node) {
        if (withApiResCode(node)) {
          checkIfStatement(node);
        }
      },
    };
  },
};
