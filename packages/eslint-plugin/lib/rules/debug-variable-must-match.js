/**
 * 写一个eslint插件，检测变量在不同的环境变量下的赋值是否具有相同的结尾
 * @type {{meta: {schema: [{additionalProperties: boolean, type: string, properties: {debugVariable: {default: string, type: string}, envVariables: {default: string[], type: string, items: {type: string}}}}], docs: {description: string, category: string, recommended: boolean}}, create: (function(*): {IfStatement: function(*): void})}}
 */
module.exports = {
  meta: {
    docs: {
      description: "检查变量在不同的环境变量下的赋值是否一致",
      category: "Possible Errors",
      recommended: true,
    },
    schema: [
      {
        type: "object",
        properties: {
          debugVariable: {
            type: "string",
            default: "__DEBUG",
          },
          envVariables: {
            type: "array",
            items: {
              type: "string",
            },
            default: ["NODE_ENV"],
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create: function (context) {
    // const { debugVariable, envVariables } = context.options[0] || {};
    const debugVariable = "API_PREFIX";
    const envVariables = ["__DEBUG"];

    const env = "__DEBUG";
    let variableMap = new Map();

    const sourceCode = context.getSourceCode();

    function checkVariable(node) {
      if (node.type === "Identifier") {
        // const env = envVariables.map((envVar) => process.env[envVar]).join("|");
        // const regex = new RegExp(`^(${env})$`, "i");

        let current = node.parent;
        while (current && current.type !== "Program") {
          if (
            current.type === "IfStatement" &&
            current.test.type === "Identifier" &&
            current.test.name === "__DEBUG"
          ) {
            const comments = sourceCode.getCommentsBefore(current);
            console.log(comments);
            // const match = comments.some((comment) => regex.test(comment.value));

            // if (!match) {
            //   context.report({
            //     node: current,
            //     message: `该变量 '${node.name}' 在不同的环境变量下的赋值不一致`,
            //   });
            // }
          }
          current = current.parent;
        }
      }
    }

    function checkDebugVariable(node) {
      if (node.test.type === "Identifier" && node.test.name === env) {
        let body = node.consequent.body;
        body.forEach((item) => {
          if (item.type === "ExpressionStatement") {
            if (
              item.expression.type === "AssignmentExpression" &&
              item.expression.left.type === "Identifier"
            ) {
              variableMap.set(
                item.expression.left.name,
                item.expression.right.value,
              );
            }
          }
        });
        // 循环查找外层是否声明，或者重新赋值了variableMap中的变量
        let current = node.parent;
        while (current && current.type !== "Program") {}
        // console.log(variableMap)
      }
    }

    return {
      Identifier: checkVariable,
      // IfStatement: checkDebugVariable,
    };
  },
};
