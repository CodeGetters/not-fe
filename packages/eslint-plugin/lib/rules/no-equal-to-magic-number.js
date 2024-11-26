const utils = require("../utils");
module.exports = {
  meta: {
    docs: {
      description: "no equal to a magic number， using named constants instead",
      recommended: true, //  是否通过 "extends": "eslint:recommended"属性启用该规则。
    },
    fixable: null, // 修复函数
  },
  create: function (context) {
    return {
      BinaryExpression: (node) => {
        if (node.operator !== "===") return;
        if (utils.equalToANumber(node)) {
          utils.report(
            context,
            node,
            "no equal to a magic number， using named constants instead",
          );
        }
      },
    };
  },
};
