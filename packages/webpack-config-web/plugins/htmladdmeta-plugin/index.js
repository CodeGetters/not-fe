const cheerio = require("cheerio");
const simpleGit = require("simple-git");

class HtmlAddMetaPlugin {
  constructor(options) {
    this.replace = this.replace.bind(this);
    this.options = options || {};
  }
  async replace(htmlPluginData, callback) {
    // 没有body标签则退出
    const git = simpleGit();
    let fromUrl = process.env.CI_PROJECT_PATH;

    if (!fromUrl) {
      console.log("获取 CI_PROJECT_PATH 失败");
      try {
        const remoteUrl = await git.listRemote(["--get-url"]);
        console.log("获取远程git地址成功, remoteUrl：", remoteUrl);
        fromUrl = remoteUrl.replace(
          /^.*ccc-gitlab.leihuo.netease.com(:32200)?\//,
          "",
        );
        fromUrl = fromUrl.replace(".git", "");
        console.log("获取远程git地址成功, fromUrl：", fromUrl);
      } catch (e) {
        fromUrl = "";
        console.log("获取远程git地址失败");
      }
    } else {
      console.log("获取CI_PROJECT_PATH成功， fromUrl：", fromUrl);
    }

    if (htmlPluginData.html.indexOf("<head") !== -1) {
      const $ = cheerio.load(htmlPluginData.html, {
        decodeEntities: false,
      });
      let commitHash = process.env.COMMIT_SHORT_SHA;

      if (!commitHash) {
        console.log("获取 COMMIT_SHORT_SHA 失败");
        try {
          commitHash = await git.show(["-s", "--format=%H"]);
          commitHash = (commitHash || "").substring(0, 8);
          console.log("获取git commit hash 成功，commitHash：", commitHash);
        } catch (e) {
          commitHash = "";
          console.log("获取git commit hash 失败");
        }
      } else {
        console.log("获取COMMIT_SHORT_SHA成功，commitHash：", commitHash);
      }

      // 添加git信息
      const $metaFrom = $("meta[name=from]");
      if (fromUrl !== "") {
        if ($metaFrom.length < 1) {
          $("head").append(`<meta name="from" content="git:${fromUrl}">`);
        } else {
          $metaFrom.attr("from", fromUrl);
        }
      } else {
        console.log("没有获取到fromUrl");
      }

      // 添加leihuo-pubs
      const $metaGeneraor = $("meta[name=generator]");
      if ($metaGeneraor.length > 1) {
        $metaGeneraor.attr("content", "leihuo-pubos");
      } else {
        $("head").append('<meta name="generator" content="leihuo-pubos">');
      }

      // 添加git hash值
      const $metaHash = $("meta[name=pubos-hash]");
      if (commitHash !== "") {
        if ($metaHash.length > 1) {
          $metaHash.attr("content", commitHash);
        } else {
          $("head").append(`<meta name="pubos_hash" content="${commitHash}">`);
        }
      }
      htmlPluginData.html = $.html();
    } else {
      console.log("没有head标签");
    }

    let projectId = this.options.projectId;
    if (!projectId) {
      try {
        if (process.env.WEBPUB_PROJECT_ID) {
          projectId = process.env.WEBPUB_PROJECT_ID;
        } else {
          console.log("获取 WEBPUB_PROJECT_ID 失败");
        }
      } catch (e) {
        console.log("获取projectId失败");
      }
    } else {
      console.log("获取projectId失败");
    }

    if (fromUrl && projectId) {
      const gitInfo = fromUrl.replace("git:", "");
      const tips = `<!--This is Git Project From ${gitInfo}(${projectId})-->`;
      htmlPluginData.html += tips;
    }
    callback(null, htmlPluginData);
  }

  apply(compiler) {
    if (compiler.hooks) {
      compiler.hooks.compilation.tap("HtmlAddMetaPlugin", (compilation) => {
        if (compilation.hooks.htmlWebpackPluginAfterHtmlProcessing) {
          compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
            "HtmlAddMetaPlugin",
            this.replace,
          );
        } else {
          var HtmlWebpackPlugin = require("html-webpack-plugin");

          if (!HtmlWebpackPlugin) {
            throw new Error(
              "Please ensure that `html-webpack-plugin` was placed before `html-replace-webpack-plugin` in your Webpack config if you were working with Webpack 4.x!",
            );
          }

          HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
            "HtmlAddMetaPlugin",
            this.replace,
          );
        }
      });
    } else {
      compiler.plugin("compilation", (compilation) => {
        compilation.plugin("html-webpack-plugin-beforeEmit", this.replace);
      });
    }
  }
}

module.exports = HtmlAddMetaPlugin;
