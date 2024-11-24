const fs = require("fs");
const path = require("path");

const webpack = require("webpack");
const merge = require("webpack-merge");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const EncodingPlugin = require("encoding-plugin");
const CrossoriginWebpackPlugin = require("crossorigin-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("leihuo-html-webpack-plugin");

const LeihuoHtmlAddMetaPlugin = require("./plugins/htmladdmeta-plugin/index.js");
const LeihuoBmrSdkAddPlugin = require("./plugins/bmr-sdk-add-pluigin/index.js");
const LeihuoGlobalIncludePlugin = require("./plugins/global-include-plugin/index.js");

const TerserPlugin = require("terser-webpack-plugin");

const ReplaceTextInFilePlugin = require("./plugins/replace-text-in-file-plugin");

const { randomStr, staticDir } = require("./utils/index");
const {
  htmlReplaceRules,
  styleLoaders,
  htmlJumpLoader,
} = require("./utils/get-loaders");
const { getJsEntries, getHtmlEntries } = require("./utils/get-entry");
const { getOptions } = require("./utils/get-options");

const root = process.cwd();

module.exports = async function (env, argv, obj) {
  const options = await getOptions(argv);
  const { configName, mode, devMode, config, webpub } = options;

  console.log(options);

  // /** other constants **/
  const STATIC_DIR = config.copy.to || staticDir();
  const DEFINE_CONFIG = require("./define/" + (argv.configName || configName));

  const jsEntries = getJsEntries(config.entryDir.js);
  const htmlEntries = getHtmlEntries(config.entryDir.html);

  const baseConfig = {
    context: root,

    mode,

    entry: jsEntries,

    output: devMode
      ? {
          path: path.resolve(root, "./output"),
          filename: "[name]_[hash:8].js",
          chunkFilename: "[name]_[chunkhash:8].js",
          publicPath: "/",
          jsonpFunction: "leihuoJsonp",
        }
      : {
          path: path.resolve(root, "./dist"),
          filename: "js/[name]_[chunkhash:8].js",
          chunkFilename: "js/[name]_[chunkhash:8].js",
          publicPath: webpub.publicPath,
          jsonpFunction: randomStr(),
        },

    module: {
      rules: [
        {
          test: /\.vue$/,
          use: [
            {
              loader: "vue-loader",
              options: {
                transformAssetUrls: {
                  audio: "src",
                },
              },
            },
          ],
        },

        // js
        {
          test: /\.(js|tsx?)$/,
          exclude: [
            /node_modules[\\/](?!(three))([\\/].*)?/,
            /[\\/]js[\\/]lib/,
          ],
          use: [
            "thread-loader",
            {
              loader: "babel-loader",
              options: {
                cacheDirectory: true,
                extends: path.resolve(__dirname, "../babel.config.json"),
              },
            },
          ],
        },

        // html
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: {
                removeComments: true,
                interpolate: 1,
                attrs: [":data-src", ":src", ...config.htmlLoader.attrs],
              },
            },

            {
              loader: "replace-text-loader",
              options: {
                rules: [...htmlReplaceRules()],
              },
            },

            ...htmlJumpLoader(config.jumpLoader, configName),
          ],
        },

        // art
        {
          test: /\.art$/,
          use: "art-template-loader",
        },

        // css
        {
          test: /\.(less|css)$/,
          use: [
            ...(devMode
              ? ["style-loader", "vue-style-loader"]
              : [MiniCssExtractPlugin.loader]),
            "thread-loader",
            ...styleLoaders(devMode, root, {
              px2rem: config.px2rem,
            }),
            {
              loader: "style-resources-loader",
              options: {
                patterns: require.resolve("leihuo-less-mixins"),
                injector: "prepend",
              },
            },
          ],
        },

        // 特殊 css 打包处理，登录组件用
        {
          test: /\._(less|css)$/,
          include: [path.resolve(root, "./src")],
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: "css",
                name: "[name]_[hash:8].css",
              },
            },
            "extract-loader",
            ...styleLoaders(devMode, root, {
              px2rem: false,
              noSprite: true, // extract的用sprite，本地热更会出问题
            }),
          ],
        },

        // 图片/字体/媒体资源处理
        {
          test: /\.(mp4|webm|mp3)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: "assets",
                publicPath: webpub.mediaPath + "assets/",
                name(resourcePath, resourceQuery) {
                  const filename = path.basename(resourcePath);
                  if (/^[a-zA-Z0-9_\-@.]+$/.test(filename)) {
                    return "[name]_[hash:8].[ext]";
                  }
                  return "[hash:16].[ext]";
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp|ttf|eot|woff|woff2|otf|ogg|wav|flac|aac|glb|gltf|fbx|mmd|obj|atlas|cube)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: "assets",
                name(resourcePath, resourceQuery) {
                  const filename = path.basename(resourcePath);
                  resourceQuery = resourceQuery || "";
                  if (
                    resourcePath.indexOf("keep_origin") > -1 ||
                    resourceQuery.indexOf("nowebp") > -1
                  ) {
                    return "keep_origin/[name]_[hash:8].[ext]";
                  }
                  if (/^[a-zA-Z0-9_\-@.]+$/.test(filename)) {
                    return "[name]_[hash:8].[ext]";
                  }
                  return "[hash:16].[ext]";
                },
              },
            },
          ],
        },
      ],
    },

    externals: {
      jquery: "window.jQuery",
      vue: "Vue",
      "vue-router": "VueRouter",
    },

    resolve: {
      modules: ["node_modules", path.resolve(__dirname, "../node_modules")],
      extensions: [".js", ".vue", ".json", ".ts", ".tsx"], // 几个可以忽略后缀的配置
      alias: {
        "@": path.resolve(root, "./src"),
      },
    },

    resolveLoader: {
      modules: ["node_modules", path.resolve(__dirname, "../node_modules")],
    },

    optimization: {
      minimize: configName === "release",
      minimizer: [
        new TerserPlugin({
          cache: true,
          extractComments: false,
        }),
      ],
      splitChunks: {
        chunks: "all",
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
          },
          lib: {
            test: /[\\/]js[\\/]lib[\\/]/,
            name: "lib",
          },
          default: false,
        },
      },
    },

    plugins: [
      new EncodingPlugin({
        encoding: "utf-8",
      }),
      new VueLoaderPlugin(),
      new CleanWebpackPlugin(["dist/*"], {
        root: root,
        verbose: true,
        dry: false,
      }),

      new webpack.DefinePlugin({
        __CDNPATH: JSON.stringify(webpub.cdnPath),
        __CDN_PATH: JSON.stringify(webpub.cdnPath),
        __STATIC_PATH: JSON.stringify(webpub.cdnPath + STATIC_DIR),
        __MEDIA_PATH: JSON.stringify(webpub.mediaCdnPath),
        __STATIC_MEDIA_PATH: JSON.stringify(webpub.mediaCdnPath + STATIC_DIR),
        ...DEFINE_CONFIG,
      }),

      ...(!fs.existsSync(path.resolve(root, config.copy.from))
        ? []
        : [
            new CopyPlugin([
              {
                ...config.copy,
                from: path.resolve(root, config.copy.from),
                to: STATIC_DIR,
                ignore: [".*"],
              },
            ]),
          ]),

      ...(devMode
        ? [
            // 热更新的两个插件
            new webpack.NamedModulesPlugin(),
            new webpack.HotModuleReplacementPlugin(),
          ]
        : [
            new webpack.HashedModuleIdsPlugin(),
            new MiniCssExtractPlugin({
              filename: "css/[name]_[contenthash:8].css",
              publicPath: "css",
            }),
          ]),

      // htmls
      ...htmlEntries
        .filter((entry) => {
          const isCmsPage = entry.template.indexOf("__cms") > -1;
          if (configName !== "release") {
            return true;
          }
          return !isCmsPage;
        })
        .map((entry) => {
          if (entry.template.indexOf("src/inline") > -1) {
            return undefined;
          }

          const isCmsPage = entry.template.indexOf("__cms") > -1;

          const conf = {
            filename: entry.filename,
            template: entry.template,
            chunks: isCmsPage
              ? []
              : [entry.chunkName, "vendor", "runtime", "lib"],
            autoCreateHead: false,
          };

          if (devMode) {
            const entryName = `_refresh_html_${entry.chunkName}`;
            jsEntries[entryName] = entry.template;
            conf.chunks.push(entryName);
          }

          return new HtmlWebpackPlugin(conf);
        }),
      new ReplaceTextInFilePlugin({
        rules: webpub.isGlobal
          ? [
              // prefetch域名
              {
                pattern:
                  /rel="dns-prefetch" href="https?:\/\/res\.nie\.netease\.com"/g,
                replacement:
                  'rel="dns-prefetch" href="https://comm.res.easebar.com"',
              },
              {
                pattern:
                  /rel="dns-prefetch" href="https?:\/\/nie\.res\.netease\.com"/g,
                replacement:
                  'rel="dns-prefetch" href="https://comm.res.easebar.com"',
              },
              {
                pattern:
                  /rel="dns-prefetch" href="https?:\/\/comm\.res\.netease\.com"/g,
                replacement:
                  'rel="dns-prefetch" href="https://comm.res.easebar.com"',
              },
              // cdn域名
              {
                pattern:
                  /https:\/\/nie\.res\.netease\.com\/comm\/js\/nie\/ref\/css\/element-ui\.css/g,
                replacement:
                  "https://comm.res.easebar.com/js/nie/ref/css/element-ui-oversea.css",
              },
              {
                pattern:
                  /https:\/\/comm\.res\.netease\.com\/js\/nie\/ref\/css\/element-ui\.css/g,
                replacement:
                  "https://comm.res.easebar.com/js/nie/ref/css/element-ui-oversea.css",
              },
              {
                pattern:
                  /https:\/\/comm\.res\.easebar\.com\/js\/nie\/ref\/css\/element-ui\.css/g,
                replacement:
                  "https://comm.res.easebar.com/js/nie/ref/css/element-ui-oversea.css",
              },
              {
                pattern: /https:\/\/nie\.res\.netease\.com\/comm/g,
                replacement: "https://comm.res.easebar.com",
              },
              {
                pattern: /https:\/\/comm\.res\.netease\.com/g,
                replacement: "https://comm.res.easebar.com",
              },
              // 埋点接口
              {
                pattern: /https:\/\/ccc\.hi\.163\.com\/lhpp\/udsp\/api/g,
                replacement: "https://ccc.leihuo.easebar.com/lhpp/udsp/api",
              },
              {
                pattern: /https:\/\/api\.narakathegame\.com\/lhpp\/udsp\/api/g,
                replacement: "https://ccc.leihuo.easebar.com/lhpp/udsp/api",
              },
            ]
          : [
              // prefetch域名
              {
                pattern:
                  /rel="dns-prefetch" href="https?:\/\/comm\.res\.easebar\.com"/g,
                replacement:
                  'rel="dns-prefetch" href="https://nie.res.netease.com"',
              },
              // cdn域名
              {
                pattern:
                  /https:\/\/comm\.res\.easebar\.com\/js\/nie\/ref\/css\/element-ui-oversea\.css/g,
                replacement:
                  "https://nie.res.netease.com/comm/js/nie/ref/css/element-ui.css",
              },
              {
                pattern:
                  /https:\/\/comm\.res\.netease\.com\/js\/nie\/ref\/css\/element-ui-oversea\.css/g,
                replacement:
                  "https://nie.res.netease.com/comm/js/nie/ref/css/element-ui.css",
              },
              {
                pattern:
                  /https:\/\/nie\.res\.netease\.com\/comm\/js\/nie\/ref\/css\/element-ui-oversea\.css/g,
                replacement:
                  "https://nie.res.netease.com/comm/js/nie/ref/css/element-ui.css",
              },
              {
                pattern: /https:\/\/comm\.res\.easebar\.com/g,
                replacement: "https://nie.res.netease.com/comm",
              },
              // 埋点接口
              {
                pattern: /https:\/\/api\.narakathegame\.com\/lhpp\/udsp\/api/g,
                replacement: "https://ccc.hi.163.com/lhpp/udsp/api",
              },
              {
                pattern:
                  /https:\/\/ccc\.leihuo\.easebar\.com\/lhpp\/udsp\/api/g,
                replacement: "https://ccc.hi.163.com/lhpp/udsp/api",
              },
            ],
      }),
    ],

    devServer: {
      contentBase: path.resolve(root, "./src"),
      hot: true,
      compress: true,
      open: true,
      disableHostCheck: true,
      https: false,
      host: "test.163.com",
      port: 9000,
      ...config.devServer,
    },
  };

  // html相关插件
  if (htmlEntries.length > 0) {
    // global插件
    baseConfig.plugins.push(
      new LeihuoGlobalIncludePlugin({
        ...config.globalIncludePlugin,
        host: webpub.hostPath,
        testPathName: webpub.testHostPath,
        publishPath: webpub.projectPath,
        env: configName,
      }),
    );

    if (!devMode) {
      // 添加git信息到meta
      baseConfig.plugins.push(
        new LeihuoHtmlAddMetaPlugin({
          projectId: webpub.projectId,
        }),
      );
    }

    const { debug, ...fmpConfig } = config.frontMonitorPlugin || {};
    // 错误监控 & vConsole
    if (!config.disableFrontMonitor) {
      baseConfig.plugins.push(
        new LeihuoBmrSdkAddPlugin({
          ...fmpConfig,
          env: configName,
        }),
      );
    }

    // script 添加 crossorigin
    baseConfig.plugins.push(
      new CrossoriginWebpackPlugin({
        crossorigin: "",
      }),
    );
  }

  if (config.enableSourceMap || webpub.enableSourceMap) {
    baseConfig.devtool = "hidden-source-map";
  }

  return merge(baseConfig, config.webpackConfig || {}, obj);
};
