let restrictedApis = ["open"];
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "非必要不使用window api: ",
      category: "Best Practices",
      recommended: true,
    },
    // schema: {
    //   type: "object",
    //   properties: {
    //     apis: {
    //       type: "array",
    //       items: {
    //         type: "string",
    //       },
    //     },
    //   }
    // }
  },
  create(context) {
    if (context.options[0] && context.options[0].apis) {
      const arr = [...restrictedApis, ...context.options[0].apis];
      restrictedApis = Array.from(new Set(arr));
    }
    function reportViolation(node, apiName) {
      context.report({
        node,
        message: `Do not use the window API ${apiName} unless necessary. If you need to use it, please contact your supervisor for evaluation.`,
      });
    }

    function reportWithLeihuoUtilTip(node, apiName) {
      context.report({
        node,
        message: `No window API ${apiName}. Use util.newWin(url, id, target)， see detail in https://ccc-doc.leihuo.netease.com/#/doc/leihuo-util/`,
      });
    }

    function isLocationHref(node, apiName) {
      if (apiName === "location") {
        const { property } = node.parent;
        if (
          (property && property.name === "href") ||
          node.property.name === "href"
        ) {
          return true;
        }
      }
      return false;
    }

    return {
      MemberExpression(node) {
        const objectName = node.object.name;
        if (node.object.type === "Identifier") {
          const apiName =
            objectName === "window" ? node.property.name : objectName;
          if (restrictedApis.includes(apiName)) {
            if (apiName === "open") {
              return reportWithLeihuoUtilTip(node, apiName);
            }
            return reportViolation(node, apiName);
          }
        }
      },
    };
  },
};
