const path = require("path");
/**
 * new Date在带参数的情况下，参数必须是时间戳，且只允许在${configFileName}文件中配置
 * @type {string}
 */
let configFileName = "js/common/const.js";
configFileName = path.normalize(configFileName);
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: `new Date必须是时间戳，并且请配置在${configFileName}文件中`,
      category: "Best Practices",
      recommended: true,
    },
  },
  create(context) {
    function definInConstFile(fileName) {
      return fileName.indexOf(configFileName) !== -1;
    }
    return {
      NewExpression(node) {
        if (node.callee.name === "Date" && node.callee.type === "Identifier") {
          const fileName = context.getFilename();
          const isInConstFile = definInConstFile(fileName);
          const arguments = node.arguments;
          if (arguments && arguments.length > 0) {
            const argLen = arguments.length;
            let arg1 = arguments[0];
            // 参数多余1个 也要放在const.js中
            if (argLen > 1) {
              if (isInConstFile) return;
              context.report({
                node,
                message: `时间相关请配置在${configFileName}文件中`,
              });
              return;
            }
            // new Date(一个参数)的限制
            //1、 取自后台的时间参数，增加手动确认步骤
            if (arg1.type === "Identifier") {
              context.report({
                node,
                message: `new Date唯一参数时，必须为Number类型的毫秒时间戳。如取自接口，请联系后台修改！！确认后请使用eslint-disable-next-line忽略该行代码`,
              });
              return;
            }
            // 2、单个参数 && 非变量
            // 错误使用方式：new Date('1995-12-17T03:24:00') new Date('1692157867471')
            // 正确使用方式：new Date(1692157867471)
            if (arg1.type !== "Literal") return;
            if (
              !isInConstFile ||
              typeof arg1.value === "string" ||
              !/^\d{13}$/.test(arg1.value)
            ) {
              context.report({
                node,
                message: `new Date唯一参数时，必须为Number类型的毫秒时间戳，且请配置在${configFileName}文件中。开关类的请联系后台使用服务器时间`,
              });
            }
          }
        }
      },
    };
  },
};
