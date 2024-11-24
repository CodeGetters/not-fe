# 雷火错误监控 SDK 代码添加插件

## 安装

```
npm i --save-dev leihuo-bmr-sdk-add-plugin
```

## 使用方法

首先, 你需要同时安装 `html-webpack-plugin` and `leihuo-bmr-sdk-add-plugin`.

```shell
npm i -D html-webpack-plugin leihuo-bmr-sdk-add-plugin
```

### 在你的 `webpack.config.js` 文件中:

```javascript
const webpack = require("webpack");
const LeihuoBmrSdkAddPlugin = require("leihuo-bmr-sdk-add-plugin");

module.exports = {
  // Definition for Webpack plugins
  plugin: [
    new HtmlWebpackPlugin({
      /* configs */
    }),
    new LeihuoBmrSdkAddPlugin(),
  ],
};
```

会去使用发布系统注入的变量process.env.WEBPUB_BUILD_TYPE去区环境，不存在则为release

## 开发

#### Install

```sh
npm install
```

#### 如何发布

1. ```sh
   git commit
   ```

2. ```sh
   npm run release
   ```

3. ```sh
   git push --follow-tags origin master
   ```

4. ```sh
   npm publish
   ```
