const merge = require("webpack-merge");
const releaseConfig = require("./release");

module.exports = merge(releaseConfig, {
  __LOCAL: JSON.stringify(true),
  __DEBUG: JSON.stringify(true),
});
