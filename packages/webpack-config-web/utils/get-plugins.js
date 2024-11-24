const path = require("path");
const webpack = require("webpack");

exports.sourceMapPlugin = function (enable) {
  if (!enable) {
    return [];
  }

  return [
    new webpack.SourceMapDevToolPlugin({
      filename: "sourcemaps/[file].map",
      append: false,
      moduleFilenameTemplate: (info) => {
        const { namespace, resourcePath } = info || {};

        if (namespace) {
          return `${namespace}/${resourcePath}`;
        }

        const filePath = path.relative(process.cwd(), resourcePath);
        if (filePath.startsWith("src") && process.env.CI_COMMIT_SHA) {
          return `${process.env.CI_PROJECT_URL}/-/blob/${process.env.CI_COMMIT_SHA}/${filePath.split(path.sep).join("/")}`;
        }

        return `${namespace}/${resourcePath}`;
      },
    }),
  ];
};
