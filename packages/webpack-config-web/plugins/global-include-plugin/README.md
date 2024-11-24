# leihuo-global-include-plugin

## 概述

leihuo-global-include-plugin是一个webpack插件，和其前身leihuo-global-include-loader(现已废弃)都是用于在打包构建时，解析工程中包含的include语法并将指定的html结构引入当前页面中

生产环境的global引入通过服务器解析，不依赖组件

加载优先级：优先默认加载本地文件，不存在则加载测试/线上

## include语法示例

### 常规引用

在html中写入下述语法，打包时插件会将virtual指定路径的html引入到当前位置

```xml
  // 在html页面中
	<!--#include virtual="/include/14v3/news.html"-->
```

示例：
![image-20240229101528826](https://nie.res.netease.com/comm/images/20240229/1709173255086_1dddbc7bf3.png)

> 特别注意：include语法格式不是注释，两边没有空格，不要用快捷键当成注释去注解，会改变语法格式导致解析失败

### 全局配置

通常情况下SEO以及分享会有专门的一个全局配置仓库存放，在官网以及专题中通过include语法引用

```xml
  // 全局配置，通过#set定义
  <!--#set var="Title" value="倩女幽魂手游首款文旅联名时装上线！"-->

  // 官网引用，通过#echo将定义内容注入
  <!--#include virtual="/global_include/config.html"-->
	<title><!--#echo var='Title'--></title>
```

示例：
![image-20240229104022569](https://nie.res.netease.com/comm/images/20240229/1709174469590_cfdb659768.png)

## 组件安装

```bash
npm install --save-dev leihuo-global-include-plugin --registry https://ccc-npm.leihuo.netease.com
```

## 组件参数

|     参数     |                说明                |   类型    | 是否必选 | 默认值  |
| :----------: | :--------------------------------: | :-------: | :------: | :-----: | --------- |
|     env      |           当前环境（dist           | release） |  String  |   是    | 'release' |
|     host     |              正式host              |  String   |    是    |   '/'   |
| testPathName |              测试host              |  String   |    是    |   '/'   |
|    encode    |            引用资源编码            |  String   |    是    | 'utf-8' |
| publishPath  |              发布路径              |  String   |    否    |   ''    |
|  branchName  | 分支名称(用于查找分支测试地址资源) |  String   |    否    |   ''    |

当branchName参数未传参时，会默认使用当前分支的分支名作为参数

## 使用方法

开发环境会向目录上/下查找文件，测试环境需要传入publishPath来指定引用位置，不会进行目录查找

### 分支发布

默认情况下，处在分支上的工程会优先匹配与当前分支相同的global include

也可以传入branchName来指定不同分支的测试环境，拉取优先级为本地 > 分支测试 > 测试 > 正式

注意branchName为main或master将被忽略

```javascript
const webpack = require("webpack");
const LeihuoGlobalIncludePlugin = require("leihuo-global-include-plugin");

// 需要在html-plugin之后调用，不然没法对html做处理
const webpackConfig = {
  plugins: [
    new HtmlWebpackPlugin({
      /* configs */
    }),
    new LeihuoGlobalIncludePlugin({
      env: paramConfig.env,
      host: paramConfig.include_host,
      testPathName: paramConfig.test_include_path,
      encode: paramConfig.encode,
    }),
  ],
};

// 移动端传入发布地址publishPath
const webpackConfig = {
  plugins: [
    new HtmlWebpackPlugin({
      /* configs */
    }),
    new LeihuoGlobalIncludePlugin({
      env: paramConfig.env,
      host: paramConfig.include_host,
      testPathName: paramConfig.test_include_path,
      encode: paramConfig.encode,
      publishPath: "m/",
    }),
  ],
};

// 分支测试
const webpackConfig = {
  plugins: [
    new HtmlWebpackPlugin({
      /* configs */
    }),
    new LeihuoGlobalIncludePlugin({
      env: paramConfig.env,
      host: paramConfig.include_host,
      testPathName: paramConfig.test_include_path,
      encode: paramConfig.encode,
      branchName: "dev",
    }),
  ],
};
```

## leihuo-global-include-loader迁移leihuo-global-include-plugin

之前使用leihuo-global-include-loader来支持本地/测试环境的global include组件的使用，由于一些问题如今需要迁移替换为leihuo-global-include-plugin组件

新模板中的leihuo-webpack-config-web内置了leihuo-global-include-plugin的相关配置以及依赖，只需要更新leihuo-webpack-config-web版本到0.2.3版本以上即可

老模板中需要手动修改webpack配置，步骤如下：

1. 删除leihuo-global-include-loader依赖添加leihuo-global-include-plugin依赖

   ```bash
   npm uninstall leihuo-global-include-loader
   npm install leihuo-global-include-plugin@latest -D
   ```

2. 删除configs目录中有关leihuo-global-include-loader的相关配置，如configs/webpack.base.js中

   ```javascript
    {
      test: /\.js$/, // 支持 js
      exclude: [/node_modules/, /\/js\/lib/],
      use: [
        'happypack/loader?id=babel',
        {
          loader: 'leihuo-global-include-loader/entry.js',
          options: {
            env: paramConfig.env
          }
        }
      ]
    },
   {
      // include、inline内容解析
      loader: 'leihuo-global-include-loader',
      options: {
        env: paramConfig.env,
        host: paramConfig.include_host,
        testPathName: paramConfig.test_include_path,
        encode: paramConfig.encode
      }
    }
   ```

3. 添加leihuo-global-include-plugin相关配置，如configs/webpack.base.js中

   ```javascript
   const LeihuoGlobalIncludePlugin = require("leihuo-global-include-plugin");
   // ...
   config.plugins.push(
     new LeihuoGlobalIncludePlugin({
       env: paramConfig.env, // 当前环境(dist|release)
       host: paramConfig.include_host, // 正式host
       testPathName: paramConfig.test_include_path, // 测试host
       encode: paramConfig.encode, // 资源编码
       publishPath: "", // 组件所在项目的发布路径
     }),
   );
   ```
