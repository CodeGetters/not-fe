单独：

```json
{
  "leihuo-bmr-sdk-add-plugin": "^1.2.1",
  "leihuo-global-include-plugin": "0.0.25",
  "leihuo-html-webpack-plugin": "^3.2.1",
  "leihuo-htmladdmeta-plugin": "^0.0.20",
  "leihuo-jump-loader": "^2.0.2",
  "leihuo-less-mixins": "^0.0.7",
  "leihuo-sprites-loader": "0.0.3"
}
```

# leihuo-webpack-config-web

官网 web 项目公共 webpack 配置

## 配置文件

创建 `ccc.config.js` 放在项目根目录

默认配置如下：

```js
module.exports = {
  // devServer 相关配置
  devServer: {
    https: false,
    port: require("portfinder-sync").getPort(9000),
    host: "test.163.com",
  },

  // px 转换为 rem 单位的目录，默认 false 不进行转换
  px2rem: false,

  // 三端跳转配置
  jumpLoader: {
    clients: "pc", // 可选 pc,m,mh，英文逗号隔开
    ua: "l10webview|l12webview|nshwebview", // 内置跳转ua
    isH5: false, // 是否使用 H5 防屏蔽链接跳转规则
  },

  // 配置入口路径
  entryDir: {
    jsEntryDir: "src/entry",
    htmlEntryDir: "src/entry",
  },

  // 会被 merge 到 config
  webpackConfig: null,

  // global-include-loader 使用
  // forceGroup 是否强制使用下面配置的 group
  forceGroup: false,
  group: "qnm",

  // copy-webpack-plugin
  copy: {
    from: "src/static",
  },

  // 是否禁用错误监控
  disableFrontMonitor: false,
  frontMonitorPlugin: {
    enableTmr: false,
    debug: false, // 传true在本地启用错误监控代码
    disableVconsole: false, // 是否禁用vconsole
  },

  // 是否启用sourcemap
  enableSourceMap: false,
};
```

## 更新日志

[查看更新日志](https://ccc-gitlab.leihuo.netease.com/LEIHUO-JS/leihuo-webpack-config-web/-/blob/master/CHANGELOG.md)

## 配置说明

### 如何在测试环境开启 vConsole

正式环境不会出现 vConsole

本配置包 leihuo-webpack-config-web 升级至 0.3.1 及以上

```bash
npm i -D leihuo-webpack-config-web@latest
```

#### 如何禁用 vConsole

在 ccc.config.js 增加以下配置

```js
module.exports = {
  // ...other config
  frontMonitorPlugin: {
    disableVconsole: true, // 是否禁用vconsole
  },
};
```

#### 旧模板配置改法

升级 `leihuo-bmr-sdk-add-plugin` 至1.2.0及以上，测试环境会出现 vconsole

```bash
npm i -D leihuo-bmr-sdk-add-plugin@latest
```

**_如何禁用?_**

在 `configs/webpack.base.js` 中，找到 `new LeihuoBmrAddPlugin` 的地方，并增加如下配置

```js
new LeihuoBmrAddPlugin({
  enableTmr: true,
});
```

### 如何开启流量监控

本配置包 leihuo-webpack-config-web 升级至 0.1.38 及以上，在ccc.config.js增加如下配置

```bash
npm i -D leihuo-webpack-config-web@latest
```

```js
module.exports = {
  // ...other config
  frontMonitorPlugin: {
    enableTmr: true,
  },
};
```

#### 旧模板对应的配置改法

1. 升级 `leihuo-bmr-sdk-add-plugin` 至1.1.0及以上

```bash
npm i -D leihuo-bmr-sdk-add-plugin@latest
```

2. 在 `configs/webpack.base.js` 中，找到 `new LeihuoBmrAddPlugin` 的地方，并增加如下配置

```js
new LeihuoBmrAddPlugin({
  enableTmr: true,
});
```

### 禁止CDN转webp

大部分游戏国内CDN域名开启了图片转webp的功能，当cdn路径中包含keep_origin时，会返回原图，不转换webp

以下两种方式可保持CDN原图：

1、图片路径包含 keep_origin
2、图片query包含nowebp

#### HTML代码示意

```html
<img src="../img/m/keep_origin/xxxx.png" />
```

#### Js代码示意

```js
require("@/img/pc/keep_origin/xxx.png");
```

#### CSS代码示意

```less
// CSS 支持通过?__nowebp关键字禁止
.bg {
  background: url("../img/xxxx.png?__nowebp");
}

// 或者

.bg {
  background: url("../img/keep_origin/xxxx.png");
}

// 雪碧图仅支持放在 keep_origin目录下
.bg {
  background: url("../img/keep_origin/xxxx.png?__sprite");
}
```
