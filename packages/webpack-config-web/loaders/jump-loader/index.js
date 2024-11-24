const loaderUtils = require("loader-utils");
const path = require("path");
const fs = require("fs");

function logIt(text) {
  console.log("\x1b[41;37m " + text + " \x1b[0m");
}

let insertStr = (soure, start, newStr) => {
  return soure.slice(0, start) + newStr + soure.slice(start);
};

// 共有规则
const hasFrom = `(/(\\\\?|&)from=(mobile|desktop)/g.test(location.href))`;
const isRoot = `(['/', '/boot.html', '/index.html', '/m/', '/m/boot.html', '/m/index.html'].indexOf(window.location.pathname) > -1)`;
const isRootTest = `(['/', '/boot.html', '/index.html', '/m/', '/m/boot.html', '/m/index.html'].indexOf(window.location.pathname.replace(/^\\\\/(test_html\\\\/[a-zA-Z0-9_\\\\-\\\\.]+\\\\/)?(branch_[a-zA-Z0-9_\\\\-\\\\.]+\\\\/)?/, '/')) > -1)`;
// 跳转移动端：手机、安卓但非mumu浏览器（V417IR）、小程序内置
const isMobile = `((/iphone|ios|android|mobile/i.test(navigator.userAgent) && !/Build\\\\/V417IR/i.test(navigator.userAgent)) || /miniprogram/i.test(navigator.userAgent) || (window.__wxjs_environment === 'miniprogram'))`;
const isMh = (ua) => `(/${ua}/i.test(navigator.userAgent))`;

function insertPCjump({ ua, ignoreType, isH5, isLocal, isProduct }) {
  const pcToMh = !isH5
    ? `location.href = (location.origin + location.pathname).replace(/\\\\/?(\\\\w+\\\\.html)?$/, '/mh/$1') + location.search + location.hash`
    : isLocal
      ? `location.href = (location.origin + location.pathname).replace(/(\\\\/[\\\\w-_]+)\\\\/?(\\\\w+\\\\.html)?$/, '$1mh/$2') + location.search + location.hash`
      : `location.href = (location.origin + location.pathname).replace(/(\\\\/(h5|act)\\\\/\\\\d{8}\\\\/[\\\\w-_]+)\\\\/(.*)?$/, '$1mh/$3') + location.search + location.hash`;
  const pcToM = !isH5
    ? `location.href = (location.origin + location.pathname).replace(/\\\\/?(\\\\w+\\\\.html)?$/, '/m/$1') + location.search + location.hash`
    : isLocal
      ? `location.href = (location.origin + location.pathname).replace(/(\\\\/[\\\\w-_]+)\\\\/?(\\\\w+\\\\.html)?$/, '$1m/$2') + location.search + location.hash`
      : `location.href = (location.origin + location.pathname).replace(/(\\\\/(h5|act)\\\\/\\\\d{8}\\\\/[\\\\w-_]+)\\\\/(.*)?$/, '$1m/$3') + location.search + location.hash`;
  let script = `<script>
    if (${hasFrom}${isProduct ? ` || ${isRoot}` : isLocal ? "" : ` || ${isRootTest}`}) {
    } else if (${isMh(ua)}) {
      ${pcToMh}
    } else if (${isMobile}) {
      ${pcToM}
    }
    </script>`;

  if (ignoreType === 2) {
    script = `<script>
      if (${hasFrom}${isProduct ? ` || ${isRoot}` : isLocal ? "" : ` || ${isRootTest}`}) {
      } else if (${isMobile}) {
        ${pcToM}
      }
      </script>`;
  }

  if (ignoreType === 1) {
    script = `<script>
      if (${hasFrom}${isProduct ? ` || ${isRoot}` : isLocal ? "" : ` || ${isRootTest}`}) {
      } else if (${isMh(ua)}) {
        ${pcToMh}
      }
      </script>`;
  }

  return script;
}

function insertMjump({ ua, ignoreType, isH5, isLocal, isProduct }) {
  const mToMh = !isH5
    ? `location.href = ( location.origin + location.pathname ).replace(/(\\\\/m\\\\/|\\\\/m$)/g, '/mh/') + location.search + location.hash`
    : isLocal
      ? `location.href = (location.origin + location.pathname).replace(/(\\\\/[\\\\w-_]+)m\\\\/?(\\\\w+\\\\.html)?$/, '$1mh/$2') + location.search + location.hash`
      : `location.href = (location.origin + location.pathname).replace(/(\\\\/(h5|act)\\\\/\\\\d{8}\\\\/[\\\\w-_]+)m\\\\/(.*)?$/, '$1mh/$3') + location.search + location.hash`;
  const mToPc = !isH5
    ? `location.href = ( location.origin + location.pathname ).replace(/(\\\\/m\\\\/|\\\\/m$)/g, '/') + location.search + location.hash`
    : isLocal
      ? `location.href = (location.origin + location.pathname).replace(/(\\\\/[\\\\w-_]+)m\\\\/?(\\\\w+\\\\.html)?$/, '$1/$2') + location.search + location.hash`
      : `location.href = (location.origin + location.pathname).replace(/(\\\\/(h5|act)\\\\/\\\\d{8}\\\\/[\\\\w-_]+)m\\\\/(.*)?$/, '$1/$3') + location.search + location.hash`;
  let script = `<script>
    if (${hasFrom}${isProduct ? ` || ${isRoot}` : isLocal ? "" : ` || ${isRootTest}`}) {
    } else if (${isMh(ua)}) {
      ${mToMh}
    } else if (!${isMobile}) {
      ${mToPc}
    }
  </script>`;

  // 2in1
  if (ignoreType === 0) {
    script = `<script>
      if (${hasFrom}${isProduct ? ` || ${isRoot}` : isLocal ? "" : ` || ${isRootTest}`}) {
      } else if (${isMh(ua)}) {
        ${mToMh}
      }
      </script>`;
  } else if (ignoreType === 2) {
    script = `<script>
      if (${hasFrom}${isProduct ? ` || ${isRoot}` : isLocal ? "" : ` || ${isRootTest}`}) {
      } else if (!${isMobile}) {
        ${mToPc}
      }
      </script>`;
  }
  return script;
}

function insertMHjump({ ua, ignoreType, isH5, isLocal, isProduct }) {
  const mhToM = !isH5
    ? `location.href = (location.origin + location.pathname).replace(/(\\\\/mh\\\\/|\\\\/mh$)/g, '/m/') + location.search + location.hash`
    : isLocal
      ? `location.href = (location.origin + location.pathname).replace(/(\\\\/[\\\\w-_]+)mh\\\\/?(\\\\w+\\\\.html)?$/, '$1m/$2') + location.search + location.hash`
      : `location.href = (location.origin + location.pathname).replace(/(\\\\/(h5|act)\\\\/\\\\d{8}\\\\/[\\\\w-_]+)mh\\\\/(.*)?$/, '$1m/$3') + location.search + location.hash`;
  const mhToPc = !isH5
    ? `location.href = (location.origin + location.pathname).replace(/(\\\\/mh\\\\/|\\\\/mh$)/g, '/') + location.search + location.hash`
    : isLocal
      ? `location.href = (location.origin + location.pathname).replace(/(\\\\/[\\\\w-_]+)mh\\\\/?(\\\\w+\\\\.html)?$/, '$1/$2') + location.search + location.hash`
      : `location.href = (location.origin + location.pathname).replace(/(\\\\/(h5|act)\\\\/\\\\d{8}\\\\/[\\\\w-_]+)mh\\\\/(.*)?$/, '$1/$3') + location.search + location.hash`;

  let script = `<script>
      if (${hasFrom}${isProduct ? ` || ${isRoot}` : isLocal ? "" : ` || ${isRootTest}`}) {
      } else if (${isMh(ua)}) {
      } else if (${isMobile}) {
        ${mhToM}
      } else {
        ${mhToPc}
      }
    </script>`;

  // 2in1
  if (ignoreType === 0) {
    script = `<script>
      if (${hasFrom}${isProduct ? ` || ${isRoot}` : isLocal ? "" : ` || ${isRootTest}`}) {
      } else if (!${isMh(ua)}) {
        ${mhToM}
      }
      </script>`;
  } else if (ignoreType === 1) {
    script = `<script>
      if (${hasFrom}${isProduct ? ` || ${isRoot}` : isLocal ? "" : ` || ${isRootTest}`}) {
      } else if (!${isMh(ua)}) {
        ${mhToPc}
      }
      </script>`;
  }

  return script;
}

function insertCustomjump(entryType, rules) {
  let script = "<script>\n";

  for (let r = 0; r < rules.length; r++) {
    let curRule = rules[r];
    let realTo = "/" + curRule.to;
    if (curRule.to === "pc") {
      realTo = "";
    }
    if (curRule.from === entryType) {
      let jumpCode = `location.href = ( location.origin + location.pathname ).replace(/\\\\/${curRule.from}\\\\/?(\\\\w+\\\\.html)?$/g, '${realTo}/$1') + location.search + location.hash`;
      if (curRule.from === "pc") {
        jumpCode = `location.href = ( location.origin + location.pathname ) + '${curRule.to}/' + location.search + location.hash`;
      }
      if (curRule.to.indexOf("http") === -1) {
        // 非自定义
        // 判断是否
        let opposite = curRule.ua[0] === "!";
        if (opposite) {
          script += `if (!/${curRule.ua.substring(1, curRule.ua.length)}/i.test(navigator.userAgent.toLowerCase())) {
            ${jumpCode}
          }\n`;
        } else {
          script += `if (/${curRule.ua}/i.test(navigator.userAgent.toLowerCase())) {
            ${jumpCode}
          }\n`;
        }
      } else {
        // 判断是否
        let opposite = curRule.ua[0] === "!";
        if (opposite) {
          script += `if (!/${curRule.ua.substring(1, curRule.ua.length)}/i.test(navigator.userAgent.toLowerCase())) {
            location.href = "${curRule.to}"
          }\n`;
        } else {
          script += `if (/${curRule.ua}/i.test(navigator.userAgent.toLowerCase())) {
            location.href = "${curRule.to}"
          }\n`;
        }
      }
    }
  }

  return script + "</script>";
}

function startInsertJumpCode(content, script) {
  // 直接插入到入口HTML中的head中
  let reg = /<\/head>/g;
  let res = reg.exec(content);
  return insertStr(content, res.index, script);
}

function getEntryType(entry, type) {
  let entryReg = /src[\\/](client|entry|pages)(.*)$/g.exec(entry);
  let entryType = "other";
  if (entryReg) {
    if (!entryReg[2]) {
      entryType = "pc";
    } else if (entryReg[2].indexOf("global_include") > -1) {
      logIt(`leihuo-jump-loader: global_include入口不处理${entry}`);
      entryType = "other";
    } else if (/m$/g.test(entryReg[2])) {
      entryType = "m";
    } else if (/mh$/g.test(entryReg[2])) {
      entryType = "mh";
    } else {
      // 到这一步就是错误的入口了
      if (type === "3in1" || type === "2in1") {
        // logIt(`leihuo-jump-loader: 错误的入口地址:${entry}，请检查client文件夹的结构!`)
        // 默认是PC的
        entryType = "pc";
      } else {
        // 自定义目录
        let res = /\w+$/g.exec(entryReg[2]);
        if (res) {
          entryType = res[0];
        } else {
          logIt(
            `leihuo-jump-loader: 错误的入口地址:${entry}，请检查client/entry/pages文件夹的结构!`,
          );
        }
      }
    }
  }
  return entryType;
}

function convertHttps(script) {
  let httpsCode = `
  if( /^http\\\\:/.test( location.href ) ) {
    location.href = location.href.replace(/^http\\\\:/, 'https:')
  }`;
  return insertStr(script, 8, httpsCode);
}

module.exports = function (content) {
  const conf = loaderUtils.getOptions(this) || {};
  let env = conf.env;
  if (env) {
    // ok, use it
  } else if (/(start|dev)/g.test(process.env.npm_config_argv)) {
    env = "dev";
  } else if (/(dist|pre)/g.test(process.env.npm_config_argv)) {
    env = "dist";
  } else {
    env = "release";
  }
  // 判断是本地环境么
  const __LOCAL = env === "dev";
  // 判断是正式环境么
  const __PRODUCT = env === "release";
  const type = conf.type || "3in1";
  const ua = conf.ua || "l12webview|l10webview|nshwebview";
  const isH5 = conf.isH5 || false;
  const h5Keyword = conf.h5Keyword || "h5";
  const removeLocalUAJump = conf.removeLocalUAJump || false;
  // 2in1的入口。默认pc和m
  const twoin1entry = conf.entry || [0, 1];
  // 获取入口
  const entry = this._module.context;

  let entryType = getEntryType(entry, type);
  if (entryType === "other") {
    // 过滤没用的入口
    return content;
  }

  if (type === "3in1" || type === "2in1") {
    // 3合1模板
    let script = "";
    let ignoreType = -1;
    if (type === "2in1") {
      ignoreType = [0, 1, 2].filter(
        (val) => val !== twoin1entry[0] && val !== twoin1entry[1],
      )[0];
    }
    if (entryType === "pc") {
      script = insertPCjump({
        ua,
        ignoreType,
        isH5,
        isLocal: __LOCAL,
        isProduct: __PRODUCT,
      });
    } else if (entryType === "m") {
      script = insertMjump({
        ua,
        ignoreType,
        isH5,
        isLocal: __LOCAL,
        isProduct: __PRODUCT,
      });
    } else if (entryType === "mh") {
      // 本地模式就不管ua了
      if (!removeLocalUAJump || !__LOCAL) {
        script = insertMHjump({
          ua,
          ignoreType,
          isH5,
          isLocal: __LOCAL,
          isProduct: __PRODUCT,
        });
      }
    }
    // 最终处理，非本地环境把非https跳转强制修改为https
    if (!__LOCAL) {
      script = convertHttps(script);
    }
    content = startInsertJumpCode(content, script);
  }

  if (type === "custom") {
    let customRules = conf.customRules;
    if (!customRules) {
      logIt(`leihuo-jump-loader: 缺失自定义的规则！请配置customRules！`);
      return content;
    } else {
      let script = "";
      script = insertCustomjump(entryType, customRules);
      // 最终处理，非本地环境把非https跳转强制修改为https
      if (!__LOCAL) {
        script = convertHttps(script);
      }
      content = startInsertJumpCode(content, script);
    }
  }

  logIt("----------------jump-loader(1.2.0)-end----------------");

  return content;
};
