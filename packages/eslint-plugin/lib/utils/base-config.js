module.exports = {
  defaultWords: {
    // 错别字: 正确字
    登陆: "登录",
    帐号: "账号",
  },
  mediaType: ["video", "audio"],
  extrenalCdnList: [
    // html script
    "www.jsdelivr.com/",
    "www.bootcdn.cn/",
    "cdnjs.com/",
    "unpkg.com/",
    "www.staticfile.org", // 七牛
    "cdn.bytedance.com", // 字节
    "cdnjs.net",
    "cdn.baomitu.com", // 原360 含google字体库
    "cdnjs.cloudflare.com",
  ],
  blackList: [
    // Literal
    "https://sixhorse.game.163.com/",
  ],
  gameDownloadLinkWiteList: [
    "d90.gdl.netease.com",
    "qn.gdl.netease.com",
    "nshlite.gdl.netease.com",
    "nsh.gdl.netease.com",
  ],
};
