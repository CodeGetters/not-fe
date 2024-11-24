const cheerio = require("cheerio");

class LeihuoBmrSdkAddPlugin {
  constructor(opts) {
    this.options = Object.assign(
      {},
      {
        enableTmr: false,
        disableVconsole: false,
      },
      opts || {},
    );

    this.handleSdkScript = this.handleSdkScript.bind(this);
  }

  handleSdkScript(htmlPluginData, callback) {
    if (htmlPluginData.html.indexOf("</body>") >= 0) {
      console.log("LeihuoBmrSdkAddPlugin 开始添加错误监控sdk");
      let $ = cheerio.load(htmlPluginData9.html, { decodeEntities: false });
      let envScriptText = this.getTargetScriptText();
      let body = $("body");
      body.append(envScriptText);
      htmlPluginData.html = $.html();
      callback(null, htmlPluginData);
      console.log("LeihuoBmrSdkAddPlugin 错误监控sdk添加完成");
    } else {
      console.log("LeihuoBmrSdkAddPlugin: 不存在body，不添加");
      callback();
    }
  }

  //没传认为是国内
  checkAbroad(host) {
    if (!host) return false;
    let CNHostList = [
      "163.com",
      "yjwujian.cn",
      "f5gamesshow.cn",
      "blizzard.cn",
    ];
    for (let i = 0; i < CNHostList.length; i++) {
      let item = CNHostList[i];
      if (host.indexOf(item) >= 0) {
        return false;
      }
    }

    return true;
  }

  getTargetScriptText() {
    const env = this.options.env || process.env.WEBPUB_BUILD_TYPE;
    const isAbroad = this.checkAbroad(process.env.WEBPUB_HOST_PATH);
    const releaseCdnPath = isAbroad
      ? "https://comm.res.easebar.com/"
      : "https://nie.res.netease.com/comm/";
    let sdkPath = "";
    let scriptText = "";

    // 添加 vConsole
    if (env !== "release" && !this.options.disableVconsole) {
      scriptText +=
        `<script src="${releaseCdnPath}js/nie/ref/vconsole.3.15.1.min.js"></script>` +
        "<script>var vConsole = new window.VConsole();</script>";
    }

    // 处理错误/流量监控sdk
    if (env === "release" || env === "dist") {
      sdkPath = `${env === "release" ? releaseCdnPath : "https://test.nie.163.com/test_cdn/nie-js/"}js/leihuo/frontMonitorSDK`;
      if (!isAbroad && this.options && this.options.enableTmr) {
        scriptText += `<script src="${sdkPath}/lh-tmr-sdk.js" crossorigin></script>`;
      }
      scriptText += `<script src="${sdkPath}/lh-bmr-sdk.js" crossorigin></script>`;
    }

    return scriptText;
  }

  apply(compiler) {
    if (compiler.hooks) {
      compiler.hooks.compilation.tap("LeihuoBmrSdkAddPlugin", (compilation) => {
        if (compilation.hooks.htmlWebpackPluginAfterHtmlProcessing) {
          compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
            "LeihuoBmrSdkAddPlugin",
            this.handleSdkScript,
          );
        } else {
          let HtmlWebpackPlugin = require("html-webpack-plugin");

          if (!HtmlWebpackPlugin) {
            throw new Error("请确保添加了`html-webpack-plugin`");
          }

          HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
            "LeihuoBmrSdkAddPlugin",
            this.handleSdkScript,
          );
        }
      });
    } else {
      compiler.plugin("compilation", (compilation) => {
        compilation.plugin(
          "html-webpack-plugin-beforeEmit",
          this.handleSdkScript,
        );
      });
    }
  }
}

module.exports = LeihuoBmrSdkAddPlugin;
