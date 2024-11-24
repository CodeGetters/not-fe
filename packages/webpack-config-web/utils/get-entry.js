const glob = require("glob");
const path = require("path");

// 获取js入口
exports.getJsEntries = function (entryDir) {
  entryDir = entryDir || "src/entry";
  const entries = getEntries(glob.sync(entryDir + "/**/*.js"), entryDir);
  const jsEntries = {};

  entries.forEach((entry) => {
    jsEntries[entry.name] = entry.resolvedPath;
  });

  return jsEntries;
};

// 获取html入口
exports.getHtmlEntries = function (entryDir) {
  entryDir = entryDir || "src/entry";
  const entries = getEntries(glob.sync(entryDir + "/**/*.html"), entryDir);

  const htmls = [];

  entries.forEach((entry) => {
    htmls.push({
      filename: entry.relFile,
      template: entry.resolvedPath,
      chunkName: entry.name,
    });
  });

  return htmls;
};

function getEntries(files, entryDir) {
  const entries = [];

  files.forEach((file) => {
    const dirname = path.dirname(file); // path.dirname('src/entry/test/path/file.ext') => 'src/entry/test/path'
    const extname = path.extname(file); // path.extname('src/entry/test/path/file.ext') => '.ext'
    const basename = path.basename(file, extname); // path.basename('src/entry/test/path/file.ext', '.ext') => 'file'

    const name = path
      .relative(entryDir, path.join(dirname, basename))
      .split(path.sep)
      .join("/"); // 'src/entry/test/path/file.ext' => 'test/path/file'
    const relFile = path.relative(entryDir, file); // 'src/entry/test/path/file.ext' => 'test/path/file.ext'
    const resolvedPath = path.resolve(file);

    entries.push({
      name,
      extname,
      relFile,
      resolvedPath,
    });
  });

  return entries;
}
