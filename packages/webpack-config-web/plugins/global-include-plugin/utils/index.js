const packageData = require("../package.json");
const spawn = require("cross-spawn");

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

exports.onFatalError = (message) => {
  process.exitCode = 2;

  const version = packageData.version;

  console.error(`
Something went Error! :(

leihuo-global-include-plugin: ${version}

${message}

)`);
  process.exit(2);
};
