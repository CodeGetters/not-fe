const MESSAGES_IDS = {
  RESOURCE_LINK_UNEXPECTED: {
    id: "resource-link-unexpected",
    msg: "资源地址必须使用https，且不能有空格，汉字，中文字符",
  },
  API_HOST_FILE_LIMIT: {
    id: "api-host-file-unexpected",
    msg: '接口地址必须配置在"js/api/host.js"文件中',
  },
  RESOURCE_LINK_ENCODED_UNEXPECTED: {
    id: "resource-link-encoded-unexpected",
    msg: "资源地址？前面不允许出现转义后的中文", // 参数中转义后的是ok的
  },
  PAGE_URL_TAIL: {
    id: "page-url-tail",
    msg: "组内页面地址必须以/结尾，若为提供的外部地址，请以提供的为准",
  },
  OVERSEAS_RESOURCE_LINK_UNEXPECTED: {
    id: "overseas-resource-link-unexpected",
    msg: "海外项目，必须使用海外资源地址",
  },
  IMPORT_NO_CHINESE: {
    id: "import-no-chinese",
    msg: "import/require module名中不允许带中文字符",
  },
  NO_EXTRENAL_CDN: {
    id: "no-external-cdn",
    msg: `禁止使用外部cdn资源，请安装相应的npm包`,
  },
  NO_VCONSOLE: {
    id: "no-vconsole",
    msg: `禁止开发单独使用vconsole插件，请删除。如果使用请升级npm i leihuo-webpack-config-web@latest -D，详见文档有关vConsole说明https://ccc-doc.leihuo.netease.com/#/doc/leihuo-webpack-config-web/`,
  },
  HTML_INCLUDE_SYNTAX_ERROR: {
    id: "include-syntax-error",
    msg: `SSI include语法错误，请注意空格，严格按照此格式<!--#include virtual="/xxx/xxx.html"-->`,
  },
  HTML_INCLUDE_NO_BRANCH: {
    id: "include-no-branch",
    msg: `禁止代码中include分支global内容，请升级leihuo-webpack-config-web到最新版，带分支名的测试地址会自动匹配同分支名的global include内容`,
  },
  BLACK_COMMON: {
    id: "black-error",
    msg: "禁止使用{{ name }}",
  },
  NO_GAME_DOWNLOAD: {
    id: "no-game-download-link",
    msg: "禁止使用该下载链接，请联系产品走手游下载系统",
  },
  NO_NIE_VIDEO_LINK: {
    id: "no-nie-video-link",
    msg: "禁止使用nie.v.netease.com的视频地址，请联系张帝hzzhangdi@corp.netease.com替换",
  },
};
const MESSAGES_OBJ = Object.keys(MESSAGES_IDS).reduce((temp, item) => {
  if (!temp[MESSAGES_IDS[item].id]) {
    temp[MESSAGES_IDS[item].id] = MESSAGES_IDS[item].msg;
  }
  return temp;
}, {});

module.exports = {
  MESSAGES_IDS,
  MESSAGES_OBJ,
};
