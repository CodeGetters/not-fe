const path = require("path");

// html 字符串替换
exports.htmlReplaceRules = function () {
  return [
    {
      // inline script, 匹配所有的<script src="package?__inline"></script> 需要inline的标签
      // 并且替换为
      // <script>${require('raw-loader!babel-loader!../../node_modules/@tencent/report
      // - whitelist')}</script> 语法
      pattern: /<script.*?src="(.*?)\?__inline".*?>.*?<\/script>/gim,
      replacement: (source) => {
        // 找到需要 inline 的包
        const result = /<script.*?src="(.*?)\?__inline"/gim.exec(source);
        const pkg = result && result[1];
        return (
          "<script>${require('raw-loader!babel-loader!./" + pkg + "')}</script>"
        );
      },
    },
    {
      // 补全a标签中路径为图片资源
      pattern: /<a.*?href="(.*?)".*?>/gim,
      replacement: (source) => {
        // 找到需要的a标签
        const result = /<a.*?href="(.*?)".*?>/gim.exec(source);
        const pkg = result && result[1];
        if (
          (pkg.indexOf(".png") > -1 ||
            pkg.indexOf(".gif") > -1 ||
            pkg.indexOf(".jpg") > -1) &&
          pkg.indexOf("http") === -1
        )
          return source.replace(pkg, "${require('./" + pkg + "')}");

        return source;
      },
    },
  ];
};

// less/css loader
exports.styleLoaders = function (devMode, root, loaderConfig) {
  const { px2rem, noSprite } = loaderConfig;
  return [
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        config: {
          path: path.resolve(__dirname, "../"),
          ctx: {
            px2rem,
          },
        },
      },
    },
    ...(noSprite
      ? []
      : [
          {
            loader: "leihuo-sprites-loader",
            options: devMode
              ? {
                  outputPath: "temp_file",
                  padding: 4,
                }
              : {
                  padding: 4,
                },
          },
        ]),
    {
      loader: "less-loader",
      options: {
        includePaths: [path.resolve(root, "node_modules")],
      },
    },
  ];
};

exports.htmlJumpLoader = function (loaderConfig = {}, env) {
  const { clients, ua, ...options } = loaderConfig;
  const loader = [];
  const types = (clients || "").split(",");
  const entryMap = {
    pc: 0,
    m: 1,
    mh: 2,
  };

  if (types.length > 1) {
    const type = types.length >= 3 ? "3in1" : "2in1";
    let entry = [0, 1, 2];
    if (types.length === 2) {
      entry = types.map((_) => entryMap[_]);
    }

    loader.push({
      loader: "leihuo-jump-loader",
      options: {
        env,
        type: type,
        entry: entry,
        ua: ua || "l10webview|l12webview|nshwebview",
        ...options,
      },
    });
  }

  return loader;
};
