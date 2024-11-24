const cheerio = require("cheerio");
const ICVL = require("iconv-lite");
const Path = require("path");
const http = require("http");
const https = require("https");
const BufferHelper = require("bufferhelper");
const axios = require("axios");
const packageData = require("./package.json");
const { gitBranchName, onFatalError } = require("./utils/index.js");

const MAX_RECURSION = 5; // 最大递归次数

const errorRegex = [
  /<!--#\s+include\svirtual="([^"]+)"\s*-->/gim,
  /<!--#include\svirtual="(https:\/\/|http:\/\/)[^"]+"\s*-->/gim,
  /<!--\s+#include\svirtual="([^"]+)"\s*-->/gim,
  /<!--#include\s+virtual="(\/?branch_[^"]+)"\s*-->/gim,
];

class LeihuoGlobalIncludePlugin {
  constructor(options) {
    this.options = options || {};
    this.options.encode = this.options.encode || "utf-8";
    this.isRelease = (this.options.env || "release") === "release";
    this.releaseHostPath = this.options.host || "/";
    this.testHostPath = this.options.testPathName || this.options.host || "/";
    // this.publishPath = this.options.publishPath || ''
    // this.publishSuffix = this.publishPath ? this.publishPath.replace(this.options.host,'') : ''
    this.publishSuffix = this.options.publishPath;
    this.branchName = gitBranchName() || "";
    if (
      this.options.branchName &&
      !(this.branchName === "master" || this.branchName === "main")
    ) {
      this.branchName = this.options.branchName;
    }

    console.log("[LeihuoGlobalIncludePlugin argument]", {
      ...options,
      branchName: this.branchName,
    });
  }

  randomStr(length) {
    let str = "";
    const t = "abcdefhijkmnprstwxyz";
    for (let i = 0; i < length; i++) {
      str += t.charAt(Math.floor(Math.random() * t.length));
    }
    return str;
  }

  formatUrl(host, path) {
    if (path) {
      path = path.split("/").filter((_) => !!_);
    }
    if (host) {
      const last = host.slice(-1);
      if (last === "/") {
        host = host.slice(0, -1);
      }
    }
    return `${host}/${path.join("/")}`;
  }

  _requestTest(path) {
    return new Promise(async (resolve) => {
      try {
        // 优先级：分支测试 > 测试 > 正式
        if (
          this.testHostPath &&
          this.branchName &&
          !(this.branchName === "master" || this.branchName === "main")
        ) {
          // 匹配分支测试
          const pathArr = path.split("/");
          pathArr.unshift(`branch_${this.branchName}`);
          const pathFormat = pathArr.filter((_) => !!_).join("/");
          const url = this.formatUrl(this.testHostPath, pathFormat);
          const response = await axios.head(url).catch((response) => {
            if (response && response.status === 404) {
              return response;
            }
          });
          if (response && response.status === 200) {
            console.log("[_requestTest] branchName success", url);
            return resolve({ host: this.testHostPath, path: pathFormat });
          }
        }

        if (this.testHostPath) {
          // 匹配测试
          const url = this.formatUrl(this.testHostPath, path);
          const response = await axios.head(url).catch((response) => {
            if (response && response.status === 404) {
              return response;
            }
          });
          if (response && response.status === 200) {
            console.log("[LeihuoGlobalIncludePlugin] 匹配测试", url);
            return resolve({ host: this.testHostPath, path });
          }
        }

        // 匹配正式
        const url = this.formatUrl(this.releaseHostPath, path);
        const response = await axios.head(url).catch((response) => {
          if (response && response.status === 404) {
            return response;
          }
        });
        if (response && response.status === 200) {
          console.log("[LeihuoGlobalIncludePlugin] 匹配正式", url);
          return resolve({ host: this.releaseHostPath, path });
        }

        console.log("[LeihuoGlobalIncludePlugin] 匹配失败", path);
        // console.log('[WARNING _requestTest] all fail',this.testHostPath, path);

        // 都没匹配到???
        return resolve({ host: this.testHostPath, path });
      } catch (error) {
        console.error("An error occurred:", error);
        resolve({ host: this.testHostPath, path });
      }
    });
  }

  _request(originalPath) {
    return new Promise(async (resolve) => {
      const { host, path } = await this._requestTest(originalPath);
      let useHttps = host.indexOf("https") > -1;
      const hostname = host.replace(/^https?:\/\//gi, "").replace(/\/$/gi, "");
      const options = {
        hostname,
        path,
        method: "GET",
      };

      const pathList = hostname.split("/").filter((_) => !!_);
      if (pathList.length > 1) {
        const [host, ...rest] = pathList;
        options.hostname = host;
        let pathFormat = options.path.split("/");
        if (pathFormat && pathFormat.length) {
          pathFormat = pathFormat.filter((_) => !!_);
        }
        options.path = `${rest && rest.length ? "/" + rest.join("/") : ""}/${pathFormat.join("/")}?${this.randomStr(8)}`;
      } else {
        options.path =
          options.path[0] === "/" ? options.path : "/" + options.path;
      }

      const httpAction = useHttps ? https : http;

      console.log(
        "加载远程文件",
        useHttps ? "https" : "http",
        options.hostname,
        options.path,
      );

      const req = httpAction.request(options, function (res) {
        const bufferHelper = new BufferHelper();
        res.on("data", function (chunk) {
          bufferHelper.concat(chunk);
        });
        res.on("end", function () {
          resolve(bufferHelper.toBuffer());
        });
        res.on("error", function () {
          resolve(host + "/" + path + "加载失败");
        });
      });

      req.on("error", function (error) {
        console.log(error);
        resolve(host + "/" + path + "加载失败");
      });

      req.end();
    });
  }

  compileSSI(content) {
    const setVarReg =
      /<!--#\s*set\s+var=(['"])([^\r\n]+?)\1\s+value=(['"])([\s\S]*?)\3\s*-->/gim;
    const echoReg =
      /<!--#\s*echo\s+var=(['"])([^\r\n]+?)\1(\s+default=(['"])([^\r\n]+?)\4)?\s*-->/gim;

    const setMatch = {};
    content = content.replace(
      setVarReg,
      function (ret, key, key2, value, value2) {
        setMatch[key2] = value2;
        return ret;
      },
    );

    content = content.replace(echoReg, function (ret, key, key2) {
      if (setMatch[key2]) {
        return setMatch[key2];
      }

      return ret;
    });

    return content;
  }

  async _checkHtml(compilation, name, recursionHtml, historyIndex = 0) {
    const regex = /<!--#include\s+virtual="([^"]+)"\s*-->/gim;
    const currentAsset = compilation.assets[name];

    let html = recursionHtml ? recursionHtml : currentAsset.source();

    // 校验是否包含错误的include语法
    errorRegex.forEach((reg) => {
      if (reg.test(html)) {
        const match = html.match(reg);
        const matchStr = match && match.length ? match[0] : "";
        onFatalError(
          `[LeihuoGlobalIncludePlugin Error] ${name} 包含错误的include语法 ${matchStr}`,
        );
      }
    });

    const replaceList = [];
    const requestList = [];
    let compileResult = html.replace(regex, (match, filePath) => {
      console.log(
        "[LeihuoGlobalIncludePlugin]",
        `#include virtual="${filePath}"`,
      );
      filePath = filePath.split("?")[0]; // 兼容？加hash格式

      const fileName = Path.basename(filePath);
      const directories = Path.dirname(filePath)
        .split("/")
        .filter((_) => !!_);
      const includePath = "/" + directories.join("/") + "/" + fileName;

      // 循环引用
      if (historyIndex && historyIndex >= MAX_RECURSION) {
        onFatalError(
          `[LeihuoGlobalIncludePlugin Error] 超出最大递归层数 ${filePath}`,
        );
      }

      // 查找本地是否含有文件
      const htmlList = [];

      // 先行过滤非html文件
      const assetNames = Object.keys(compilation.assets).filter((_) => {
        return Path.extname(_) === ".html";
      });
      assetNames.forEach((assetPath) => {
        const assetFileName = Path.basename(assetPath);
        const assetExtname = Path.extname(assetFileName);
        const assetNamesDirectories = Path.dirname(assetPath)
          .split(Path.sep)
          .filter((_) => !!_);
        const assetIncludePath =
          "/" + assetNamesDirectories.join("/") + "/" + assetFileName;

        let isLocal = assetIncludePath === includePath;

        if (
          this.publishSuffix !== undefined &&
          typeof this.publishSuffix === "string"
        ) {
          // 若有发布路径入参，则不进行目录查找，根据传入的发布系统suffix进行判断（用于查找本地）
          const suffixPath = (this.publishSuffix + assetIncludePath)
            .split("/")
            .filter((_) => !!_)
            .join("/");
          isLocal = "/" + suffixPath === includePath;
        } else if (process.env.NODE_ENV === "development" && !isLocal) {
          // 本地开发环境允许向下/上层查找
          isLocal = new RegExp(assetIncludePath + "$").test(includePath);
        }

        if (isLocal) {
          if (assetExtname === ".html") {
            console.log(
              "[LeihuoGlobalIncludePlugin] 匹配本地文件",
              assetIncludePath,
            );
            htmlList.push(compilation.assets[assetPath].source());
          }
        }
      });

      // 本地包含
      if (htmlList.length) {
        let replaceHtml = "";
        htmlList.forEach((htmlContent) => {
          replaceHtml += htmlContent;
        });
        return replaceHtml;
      } else {
        // 加载远程文件
        replaceList.push(match);
        requestList.push(this._request(filePath));
        return match;
      }
    });

    // 加载远程文件
    if (replaceList.length) {
      await Promise.all(requestList).then((responses) => {
        replaceList.forEach((item, index) => {
          let val = ICVL.decode(responses[index], this.options.encode);
          compileResult = compileResult.replace(item, val);
        });
      });
    }
    if (regex.test(compileResult) && historyIndex < MAX_RECURSION) {
      console.log(
        "[递归解析]",
        "入口文件：",
        name,
        "递归次数：",
        historyIndex + 1,
      );
      // 递归解析
      compileResult = await this._checkHtml(
        compilation,
        name,
        compileResult,
        historyIndex + 1,
      );
    }

    // 解析模板内容
    compileResult = this.compileSSI(compileResult);

    // 返回编译后内容
    currentAsset.source = () => compileResult;

    return compileResult;
  }

  apply(compiler) {
    console.log("[LeihuoGlobalIncludePlugin version]", packageData.version);

    if (this.isRelease) {
      // 正式环境有服务器端进行解析，不需要plugin
      console.log("正式环境不需要plugin解析include");
      return;
    }
    compiler.hooks.emit.tapAsync(
      "LeihuoGlobalIncludePlugin",
      async (compilation, cb) => {
        const assetNames = Object.keys(compilation.assets);

        for (const name of assetNames) {
          if (/\.(html)$/.test(name)) {
            await this._checkHtml(compilation, name);
          }
        }
        cb();
      },
    );
  }
}

module.exports = LeihuoGlobalIncludePlugin;
