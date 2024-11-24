const Md5 = require("md5.js");
const spawn = require("cross-spawn");

// jsonp随机字符串
exports.randomStr = function () {
  // 根据项目目录名来生成 jsonp 函数
  let dir = process.cwd();
  const md5 = new Md5().update(dir).digest("hex");
  return "leihuoJsonp_" + md5.slice(-8);
};

exports.staticDir = function () {
  const md5 = new Md5().update(Date.now() + "").digest("hex");
  return "static_" + md5.slice(-8);
};

exports.localPath = function (useHttps, host, port) {
  const protocol = useHttps ? "https:" : "http:";

  port = ":" + port;
  if (useHttps && port === 443) {
    port = "";
  } else if (!useHttps && port === 80) {
    port = "";
  }

  return `${protocol}//${host}${port}/`;
};

const getGitUrl = (dir) => {
  if (process.env.CI_PROJECT_URL) {
    return process.env.CI_PROJECT_URL; // 如："https://ccc-gitlab.leihuo.netease.com/ccc.leihuo/cccleihuo-gw-pc-demo-leihuo-global-include-plugin-gw-20230907"
  }
  const options = {};

  if (dir) {
    options.cwd = dir;
  }

  const gitSpawn = spawn.sync(
    "git",
    "remote get-url origin".split(" "),
    options,
  );
  const repo = gitSpawn.stdout.toString().trim();

  return repo;
};

exports.gitUrl = getGitUrl;

exports.gitGroup = (dir) => {
  if (process.env.CI_PROJECT_ROOT_NAMESPACE) {
    return process.env.CI_PROJECT_ROOT_NAMESPACE;
  }
  const gitUrl = getGitUrl(dir);

  if (!gitUrl) {
    return "";
  }

  const arr = gitUrl
    .replace(/(https?|ssh):\/\//, "")
    .replace(".git", "")
    .split("/");
  return arr && arr.length > 2 ? arr[1] : "";
};

exports.gitPath = (dir) => {
  if (process.env.CI_PROJECT_PATH) {
    return process.env.CI_PROJECT_PATH;
  }
  const gitUrl = getGitUrl(dir);

  if (!gitUrl) {
    return "";
  }

  const arr = gitUrl
    .replace(/(https?|ssh):\/\//, "")
    .replace(".git", "")
    .split("/");
  return arr.slice(1).join("/");
};

exports.gitBranchName = (dir) => {
  if (process.env.CI_COMMIT_BRANCH) {
    return process.env.CI_COMMIT_BRANCH; // 如："master"
  }
  const options = {};

  if (dir) {
    options.cwd = dir;
  }

  let branchName = "";
  try {
    const command = "rev-parse --abbrev-ref HEAD"; // 获取当前分支
    const gitSpawn = spawn.sync("git", command.split(" "), options);
    branchName = gitSpawn.stdout.toString().trim();
  } catch (e) {
    console.log("获取分支失败", e);
  }

  return branchName;
};

exports.groupAlias = (group) => {
  // 如gitlab中的group hhh，在发布系统中实际是h
  if (
    group &&
    group.length === 3 &&
    group[0] === group[1] &&
    group[1] === group[2]
  ) {
    return group[0];
  }
  return group;
};
