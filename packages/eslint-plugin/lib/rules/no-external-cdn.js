/**
 * @type {Rule}
 */
const { MESSAGES_OBJ, MESSAGES_IDS } = require("../utils/message-ids");
const extrenalCdnList = require("../utils/base-config").extrenalCdnList;
module.exports = {
  meta: {
    type: "code",
    docs: {
      description: "禁止使用外部cdn资源",
      recommended: true, //  是否通过 "extends": "eslint:recommended"属性启用该规则。
    },
    fixable: null,
    messages: {
      ...MESSAGES_OBJ,
    },
  },

  create(context) {
    const cdnRegexList = extrenalCdnList.map(
      (prefix) => new RegExp(`^https?:\/\/${prefix}`),
    );
    function NoExternalCdn(node) {
      if (
        node &&
        node.parent &&
        node.parent.type === "ScriptTag" &&
        node.key.value === "src"
      ) {
        const src = node.value.value;
        if (typeof src === "string") {
          for (const regex of cdnRegexList) {
            if (regex.test(src)) {
              context.report({
                node,
                messageId: MESSAGES_IDS.NO_EXTRENAL_CDN.id,
              });
              break;
            }
          }
        }
      }
    }

    return {
      Attribute: NoExternalCdn,
    };
  },
};
