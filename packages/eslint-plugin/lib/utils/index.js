// ------------------------------------------------------------------------------
// Rule Helpers
// ------------------------------------------------------------------------------

const { MESSAGES_IDS, MESSAGES_OBJ } = require("../utils/message-ids");
const whiteList = require("./base-config").gameDownloadLinkWiteList;
/**
 * Register the given visitor to parser services.
 * If the parser service of `vue-eslint-parser` was not found,
 * this generates a warning.
 *
 * @param {RuleContext} context The rule context to use parser services.
 * @param {TemplateListener} templateBodyVisitor The visitor to traverse the template body.
 * @param {RuleListener} [scriptVisitor] The visitor to traverse the script.
 * @param { { templateBodyTriggerSelector: "Program" | "Program:exit" } } [options] The options.
 * @returns {RuleListener} The merged visitor.
 */
function defineTemplateBodyVisitor(
  context,
  templateBodyVisitor,
  scriptVisitor,
  options,
) {
  if (context.parserServices.defineTemplateBodyVisitor == null) {
    const filename = context.getFilename();
    if (path.extname(filename) === ".vue") {
      context.report({
        loc: { line: 1, column: 0 },
        message:
          "Use the latest vue-eslint-parser. See also https://eslint.vuejs.org/user-guide/#what-is-the-use-the-latest-vue-eslint-parser-error.",
      });
    }
    return {};
  }
  return context.parserServices.defineTemplateBodyVisitor(
    templateBodyVisitor,
    scriptVisitor,
    options,
  );
}
/**
 * Register the given visitor to parser services.
 * If the parser service of `vue-eslint-parser` was not found,
 * this generates a warning.
 *
 * @param {RuleContext} context The rule context to use parser services.
 * @param {TemplateListener} documentVisitor The visitor to traverse the document.
 * @param { { triggerSelector: "Program" | "Program:exit" } } [options] The options.
 * @returns {RuleListener} The merged visitor.
 */
function defineDocumentVisitor(context, documentVisitor, options) {
  if (context.parserServices.defineDocumentVisitor == null) {
    const filename = context.getFilename();
    if (path.extname(filename) === ".vue") {
      context.report({
        loc: { line: 1, column: 0 },
        message:
          "Use the latest vue-eslint-parser. See also https://eslint.vuejs.org/user-guide/#what-is-the-use-the-latest-vue-eslint-parser-error.",
      });
    }
    return {};
  }
  return context.parserServices.defineDocumentVisitor(documentVisitor, options);
}

/**
 * Get the attribute which has the given name.
 * @param {VElement} node The start tag node to check.
 * @param {string} name The attribute name to check.
 * @param {string} [value] The attribute value to check.
 * @returns {VAttribute | null} The found attribute.
 */
function getAttribute(node, name, value) {
  return (
    node.startTag.attributes.find(
      /**
       * @param {VAttribute | VDirective} node
       * @returns {node is VAttribute}
       */
      (node) =>
        !node.directive &&
        node.key.name === name &&
        (value === undefined ||
          (node.value != null && node.value.value === value)),
    ) || null
  );
}

function getAttributetWithValue(node, name) {
  return (
    node.startTag.attributes.find(
      /**
       * @param {VAttribute | VDirective} node
       * @returns {node is VAttribute}
       */
      (node) =>
        !node.directive &&
        node.key.name === name &&
        node.value != null &&
        (node.value.value + "").length > 0,
    ) || null
  );
}

/**
 * @param {ASTNode} node
 * @param {string} messageId
 * @param {any} [data]
 */
function report(context, node, message, data) {
  context.report({
    node,
    message,
    data,
  });
}

/**
 * Get the directive list which has the given name.
 * @param {VElement | VStartTag} node The start tag node to check.
 * @param {string} name The directive name to check.
 * @returns {VDirective[]} The array of `v-slot` directives.
 */
function getDirectives(node, name) {
  const attributes =
    node.type === "VElement" ? node.startTag.attributes : node.attributes;
  return attributes.filter(
    /**
     * @param {VAttribute | VDirective} node
     * @returns {node is VDirective}
     */
    (node) => node.directive && node.key.name.name === name,
  );
}
/**
 * Get the directive which has the given name.
 * @param {VElement} node The start tag node to check.
 * @param {string} name The directive name to check.
 * @param {string} [argument] The directive argument to check.
 * @returns {VDirective | null} The found directive.
 */
function getDirective(node, name, argument) {
  return (
    node.startTag.attributes.find(
      /**
       * @param {VAttribute | VDirective} node
       * @returns {node is VDirective}
       */
      (node) =>
        node.directive &&
        node.key.name.name === name &&
        (argument === undefined ||
          (node.key.argument &&
            node.key.argument.type === "VIdentifier" &&
            node.key.argument.name) === argument),
    ) || null
  );
}

/**
 * equal to a number
 * @param {VElement} node The start tag node to check.
 * @param {string} name The directive name to check.
 * @param {string} [argument] The directive argument to check.
 * @returns {VDirective | null} The found directive.
 */

function equalToANumber(node) {
  const rightNode = node.right;
  return (
    node.operator === "===" &&
    rightNode.type === "Literal" &&
    typeof rightNode.value === "number"
  );
}

/**
 * Check whether the given name is Vue builtin directive name or not.
 * @param {string} name The name to check.
 * @returns {boolean} `true` if the name is a builtin Directive name
 */
function isBuiltInDirectiveName(name) {
  return (
    name === "bind" ||
    name === "on" ||
    name === "text" ||
    name === "html" ||
    name === "show" ||
    name === "if" ||
    name === "else" ||
    name === "else-if" ||
    name === "for" ||
    name === "model" ||
    name === "slot" ||
    name === "pre" ||
    name === "cloak" ||
    name === "once" ||
    name === "memo" ||
    name === "is"
  );
}

/**
 * 错别字检查
 * @param context
 * @param node
 */
function checkTypo(context, node, words) {
  if (typeof node.value === "string") {
    const str = node.value.trim();
    if (str.length > 0) {
      Object.entries(words).forEach(([wrong, correct]) => {
        if (str.includes(wrong)) {
          context.report({
            node,
            message: `错别字： "${wrong}" -> 改成"${correct}"`,
            // fix(fixer) {
            //   return fixer.replaceTextRange([node.range[0], node.range[1]], JSON.stringify(str.replace(wrong, correct)));
            // }
          });
        }
      });
    }
  }
}

function hasSpace(value) {
  return /\s/.test(value + "");
}
function containChinese(value) {
  return /[\u4E00-\u9FFF|\uff0c|\uff1f]/.test(value); // 中文字，逗号，问号
}

function containEncodedChinese(text) {
  return /%[0-9A-F]{2}/i.test(text);
}

function isOverseas(group) {
  const overseasGroup = [
    "sywmsg",
    "letsplayuno",
    "ryuseigame",
    "montreal.neteasegames",
    "narakathegame.com",
    "marvelduel.com",
    "marvelduel.tw",
    "armis.kr",
    "narakamobile.com",
    "hmt.narakathegame.com",
    "24-ent.com",
    "exptionalgames.com",
    "dunkcitymobile.com",
    "projectmugen.com",
    "forecraftgames.com",
  ];
  return overseasGroup.includes(group);
}

function checkResourceLink(context, node, value, skipPageUrlCheck) {
  if (!/^\s*(https?:)?\/\/.*/.test(value)) return;
  // 所有项目dns-prefetch 都是http，减小项目修改成本，放开限制
  // if (hasSpace(value) || !/^\s*(https:)?\/\/.*/.test(value) || containChinese(value)) {
  if (hasSpace(value) || containChinese(value)) {
    context.report({
      node,
      messageId: MESSAGES_IDS.RESOURCE_LINK_UNEXPECTED.id,
    });
    return;
  }
  // 海外项目，资源地址校验
  // const parserOptions = context.parserOptions
  // if (parserOptions && parserOptions.group) {
  //   const group = parserOptions.group
  //   if (isOverseas(group) && value.startsWith('https://nie.res.netease.com/comm/')) {
  //     context.report({
  //       node,
  //       messageId: MESSAGES_IDS.OVERSEAS_RESOURCE_LINK_UNEXPECTED.id
  //     })
  //   }
  // }
  // encodeURIComponent一下 encode之后的中文，参数允许带，link path上不允许带
  if (containChinese(decodeURIComponent(value.split("?")[0]))) {
    context.report({
      node,
      messageId: MESSAGES_IDS.RESOURCE_LINK_ENCODED_UNEXPECTED.id,
    });
    return;
  }
  if (skipPageUrlCheck) return;
  if (isTestUrl(value) || isReleaseUrl(value) || isaSpecilReleaseUrl(value)) {
    const url = value.split("#")[0].split("?")[0];
    if (url.endsWith("/")) return;
    if (!/\/([^/]+)\.\w+$/.test(url)) {
      context.report({
        node,
        messageId: MESSAGES_IDS.PAGE_URL_TAIL.id,
      });
    }
  }
}

function isTestUrl(url) {
  return /^https?:\/\/test\.(nie\.163\.com\/test_html\/|m?yjwujian\.cn|narakathegame\.com).*/.test(
    url,
  );
}
function isReleaseUrl(url) {
  // 注意避开后台接口地址
  return (
    /^https?:\/\/\w{1,}\.163\.com.*/.test(url) ||
    /^https?:\/\/(new.hi|ccc.leihuo)\.163\.com.*/.test(url)
  );
}
function isaSpecilReleaseUrl(url) {
  return (
    /^https?:\/\/(www|m|hmt).(yjwujian|narakathegame|narakamobile|dunkcitymobile|sywmsg|projectmugen|forecraftgames|letsplayuno|mattel163|exptionalgames|marvelduel)\.(cn|com).*/.test(
      url,
    ) ||
    /^https?:\/\/(chats.wenhope.com|www.ryuseigame.jp|montreal.neteasegames.com|www.marvelduel.tw|www.armis.kr|www.24-ent.com)/.test(
      url,
    )
  );
}

function isAllowLink(context, node, url) {
  if (!/^\s*(https?:)?\/\/.*/.test(url)) return;
  if (
    url.indexOf(".gdl.netease.com") > -1 &&
    !whiteList.some((item) => url.indexOf(item) > -1)
  ) {
    context.report({
      node,
      messageId: MESSAGES_IDS.NO_GAME_DOWNLOAD.id,
    });
  } else if (url.indexOf("//nie.v.netease.com") > -1) {
    context.report({
      node,
      messageId: MESSAGES_IDS.NO_NIE_VIDEO_LINK.id,
    });
  }
}

module.exports = {
  defineDocumentVisitor,
  defineTemplateBodyVisitor,
  getAttribute,
  getAttributetWithValue,
  getDirective,
  getDirectives,
  isBuiltInDirectiveName,
  report,
  equalToANumber,
  checkTypo,
  hasSpace,
  containChinese,
  checkResourceLink,
  isAllowLink,
};
