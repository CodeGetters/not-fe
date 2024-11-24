const merge = require("webpack-merge");

const {
  gitPath,
  gitGroup,
  localPath,
  gitBranchName,
  groupAlias,
} = require("./index");
const { getConfig, getGroupConfig } = require("./webpub-api");
const { loadConfig } = require("./load-config");

async function getWebpubConfig(group, forceFallback) {
  let ret = {};

  try {
    const projectPath = gitPath();
    console.log("projectPath");
    console.log(projectPath);
    if (projectPath) {
      const data = await getConfig(projectPath);
      // const { projectSet } = data
      if (data) {
        ret = {
          projectId: data.project_id,
          projectName: data.project_name,
          hostPath: data.host_path,
          testHostPath: data.test_host_path,
          projectPath: data.pub_html_path,
        };
      } else {
        throw new Error(`${projectPath}没有对应的项目集信息`);
      }
    }
  } catch (e) {
    console.error(e.message);
    let useGroup = forceFallback ? group : gitGroup() || group;
    useGroup = groupAlias(useGroup);
    console.log("useGroup");
    console.log(useGroup);
    const data = await getGroupConfig(useGroup).catch((e) => {});
    if (data) {
      const { projectSet } = data;
      ret = {
        hostPath: projectSet.pub_html_url,
        testHostPath: projectSet.test_html_url,
      };
    }
  }

  return ret;
}

exports.getOptions = async function (argv) {
  const root = process.cwd();

  /** 1. read argv **/
  const configName =
    argv.configName === "pre" ? "dist" : argv.configName || "release";
  const mode = argv.mode || "production";
  const devMode = mode === "development";

  /** 2. read config file **/
  const defaultOptions = {
    devServer: {
      https: false,
      host: "test.163.com",
    },

    entryDir: {
      js: "src/entry",
      html: "src/entry",
    },

    jumpLoader: {
      clients: "pc",
    },

    px2rem: false,

    forceGroup: false,
    group: "qnm",

    copy: {
      from: "./src/static/",
    },

    disableFrontMonitor: false,
    frontMonitorPlugin: {
      enableTmr: false,
      debug: false,
    },

    globalIncludePlugin: {
      branchName: gitBranchName(),
    },

    enableSourceMap: false,

    htmlLoader: {
      attrs: [],
    },
  };
  const config = merge(defaultOptions, loadConfig(root, configName));

  // default dev server port
  if (devMode && !config.devServer.port) {
    config.devServer.port = require("portfinder-sync").getPort(9000);
  }

  const { https, host, port } = config.devServer;

  /** 3. read env params **/
  /**
   * WEBPUB_BUILD_TYPE
   * WEBPUB_NODE_VERSION
   * WEBPUB_PROJECT_ID
   * WEBPUB_CDN_PATH
   * WEBPUB_HOST_PATH
   * WEBPUB_TEST_HOST_PATH
   * WEBPUB_ENABLE_SOURCEMAP
   * WEBPUB_PROJECT_PATH
   */
  const {
    WEBPUB_PROJECT_ID,
    WEBPUB_HOST_PATH,
    WEBPUB_TEST_HOST_PATH,
    WEBPUB_CDN_PATH,
    WEBPUB_MEDIA_PATH,
    WEBPUB_ENABLE_SOURCE_MAP,
    WEBPUB_PROJECT_PATH,
    WEB_PATH,
  } = process.env;

  // 是否需要请求接口获取配置，如果这些环境变量缺少，则请求接口补全
  const NEED_REQUEST =
    WEBPUB_HOST_PATH === undefined ||
    WEBPUB_TEST_HOST_PATH === undefined ||
    typeof WEBPUB_PROJECT_PATH !== "string";
  const webpubConfig = NEED_REQUEST
    ? await getWebpubConfig(config.group, config.forceGroup)
    : {};

  // 项目配置 & 环境变量
  const projectId = WEBPUB_PROJECT_ID || webpubConfig.projectId;
  const hostPath =
    WEBPUB_HOST_PATH || webpubConfig.hostPath || "https://qnm.163.com";
  const testHostPath =
    WEBPUB_TEST_HOST_PATH ||
    webpubConfig.testHostPath ||
    "https://test.nie.163.com/test_html/qnm";
  const projectPath =
    typeof WEBPUB_PROJECT_PATH === "string"
      ? WEBPUB_PROJECT_PATH
      : webpubConfig.projectPath;
  const enableSourceMap = WEBPUB_ENABLE_SOURCE_MAP === "1";

  let publicPath =
    config.publicPath ||
    WEBPUB_CDN_PATH ||
    (configName === "dist" ? config.testCdnPath : config.cdnPath);
  if (WEB_PATH && !publicPath) {
    publicPath =
      (configName === "dist" ? "/manage-test/" : "/manage/") + WEB_PATH + "/";
  }
  publicPath = publicPath || "/";
  let cdnPath = publicPath;
  let mediaPath = config.mediaPath || WEBPUB_MEDIA_PATH || publicPath || "/";
  let mediaCdnPath = mediaPath;
  if (devMode) {
    publicPath = "/";
    cdnPath = localPath(https, host, port);
    mediaPath = "/";
    mediaCdnPath = localPath(https, host, port);
  }

  let isGlobal = false;
  const isCn = hostPath.indexOf("163.com") > -1 || hostPath.indexOf(".cn") > -1;
  if (hostPath && !isCn) {
    isGlobal = true;
  }

  return {
    configName,
    mode,
    devMode,
    config,
    webpub: {
      projectId,
      hostPath,
      testHostPath,
      publicPath,
      cdnPath,
      mediaPath,
      mediaCdnPath,
      enableSourceMap,
      projectPath,
      isGlobal,
    },
  };
};
