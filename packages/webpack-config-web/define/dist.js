const merge = require("webpack-merge");
const releaseConfig = require("./release");

module.exports = merge(releaseConfig, {
  __DEBUG: JSON.stringify(true),
});
