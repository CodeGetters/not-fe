const path = require("path");
const { existsSync } = require("fs");

exports.loadConfig = (root, configName) => {
  const optionPath = "ccc.config.js";

  let options = {};
  if (existsSync(path.resolve(root, optionPath))) {
    options = require(path.resolve(root, optionPath));

    if (typeof options === "function") {
      options = options(configName); // 'dist'/'release'
    }
  }

  return options;
};
