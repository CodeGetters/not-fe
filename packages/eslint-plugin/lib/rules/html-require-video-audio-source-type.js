const NodeUtils = require("../utils/html-node");
const mediaType = require("../utils/base-config").mediaType;
/**
 * @type {Rule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description:
        'Video or Audio source type must be specified, such as type="video/mp4"',
      recommended: true, //  是否通过 "extends": "eslint:recommended"属性启用该规则。
    },

    fixable: null,
  },

  create(context) {
    function validMedia(media) {
      return mediaType.indexOf(media) > -1;
    }
    return {
      Tag(node) {
        if (!validMedia(node.name.toLowerCase()) || !node.children) return;
        const sources = node.children.filter(
          (child) => child.type === "Tag" && child.name === "source",
        );
        if (sources.length === 0) return;
        sources.map((i) => {
          if (!NodeUtils.hasAttrAndValue(i, "type")) {
            context.report({
              node: i,
              message:
                'Video or Audio source type must be specified, such as type="video/mp4"',
            });
          }
        });
      },
    };
  },
};
