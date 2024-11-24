# 在HTML中增加meta标签来显示项目的git信息的插件

## 增加的标签

```bash
<meta name="from" content="项目的git地址">
<meta name="generator" content="leihuo-pubos">
<meta name="pubos_hash" content="项目的git commit hash">
```

## 安装

```bash
npm install --save-dev leihuo-htmladdmeta-plugin --registry https://ccc-npm.leihuo.netease.com
```

## 使用方法

```javascript
const webpack = require("webpack");
const LeihuoHtmlAddMetaPlugin = require('leihuo-htmladdmeta-plugin');

// 需要在html-plugin之后调用，不然的化没法对html做处理
var webpackConfig = {
  plugins: [
    new HtmlWebpackPlugin({
      /* configs */
    }),
    new LeihuoHtmlAddMetaPlugin()
  ]
};


## 发布记录


- 20220622：第一个版本发布


```
