const path = require("path");
const { MESSAGES_OBJ, MESSAGES_IDS } = require("../utils/message-ids");
/**
 * eslint自定义插件，限制接口地址只能在api.js文件中声明供QA手动校验
 * @type {{meta: {}, create: exports.create}}
 */
const apis = [
  "ssl.hi.163.com",
  "nshssl.hi.163.com",
  "nshapi.hi.163.com",
  // 国内无间
  "api.yjwujian.cn/public/yjwj/",
  "preview.yjwujian.cn/public/yjwj/",
  // 海外无间
  "api.narakathegame.com/public/yjwj/",
  "preview.narakathegame.com/public/yjwj/",

  // node后台
  "ccc.hi.163.com",
  "bt.hi.163.com",
  "rc.hi.163.com",
  //测试环境
  "ssl-test.hi.163.com",
  "md-test.163.com:88",
];
let configFileName = [
  "js/api/host.js",
  "js/api/generated/generated-",
  "js/common/api.js",
];
configFileName = configFileName.map((item) => path.normalize(item));
module.exports = {
  meta: {
    docs: {
      description: "限制接口地址的变量只能在允许的文件中声明",
      category: "Possible Errors",
      recommended: true,
    },
    messages: {
      ...MESSAGES_OBJ,
    },
  },
  create: function (context) {
    // context.getFilename()

    function isUrl(str) {
      return /^(https?:)?\/\/.*/.test(str);
    }
    function isYjwujian(str) {
      return /(api|preview)\.(yjwujian|narakathegame)\.(cn|com)\/public\/yjwj\//.test(
        str,
      );
    }
    function isHi(str) {
      return /(ssl|nshssl|nshapi|ccc|bt|rc|ssl-test)\.hi\.163\.com/.test(str);
    }

    function isMdTest(str) {
      return /md-test\.163\.com/.test(str);
    }
    function checkApiHost(node) {
      const url = node.value + "";
      if (!isUrl(url)) return;
      if ((isYjwujian(url) || isHi(url) || isMdTest(url)) && !checkFileName()) {
        context.report({
          node,
          messageId: MESSAGES_IDS.API_HOST_FILE_LIMIT.id,
        });
      }
    }
    function checkFileName() {
      const fileName = context.getFilename();
      return configFileName.some((item) => fileName.indexOf(item) > -1);
    }
    return {
      Literal: checkApiHost,
    };
  },
};
