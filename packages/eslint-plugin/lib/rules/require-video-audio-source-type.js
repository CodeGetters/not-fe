const utils = require("../utils");
const mediaType = require("../utils/base-config").mediaType;
module.exports = {
  meta: {
    docs: {
      description:
        'Video or Audio source type must be specified, such as type="video/mp4"',
      recommended: true, //  是否通过 "extends": "eslint:recommended"属性启用该规则。
    },
    fixable: null, // 修复函数
  },
  create: function (context) {
    function validMedia(media) {
      return mediaType.indexOf(media) > -1;
    }
    return utils.defineTemplateBodyVisitor(context, {
      /**
       * @param {VElement} node
       */
      "VElement[rawName='source']"(node) {
        const element = node.parent;
        if (!validMedia(element.rawName)) return;
        const typeAttr = utils.getAttributetWithValue(node, "type");
        if (typeAttr) return;
        const typeDir = utils.getDirective(node, "bind", "type");
        if (typeDir && validMedia(element.rawName)) return;
        utils.report(
          context,
          node.startTag,
          'Video or Audio source type must be specified, such as type="video/mp4"',
        );
      },
    });
  },
};
