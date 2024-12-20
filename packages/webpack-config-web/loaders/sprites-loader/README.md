<h1 align="center">leihuo-sprites-loader</h1>

<h2 align="center">Install</h2>

```
npm install --save-dev leihuo-sprites-loader
```

<h2 align="center">Usage</h2>

**file.css**

```
  .image {
    background-image: url("./assets/images/example.png?__sprite");
}
```

**file.js**

```js
import css from "file.css";
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "sprites-loader", "less-loader"],
      },
    ],
  },
};
```

<h2 align="center">Options</h2>

|       Name       |         Type         |        Default         | Description                                                                                                                             |
| :--------------: | :------------------: | :--------------------: | :-------------------------------------------------------------------------------------------------------------------------------------- |
|    **`name`**    |      `{String}`      | `sprite-[hash:6].png`  | Configure a custom filename template for your file                                                                                      |
|  **`context`**   |      `{String}`      | `this.options.context` | Configure a custom file context, defaults to `webpack.config.js` [context](https://webpack.js.org/configuration/entry-context/#context) |
| **`outputPath`** | `{String\|Function}` | `Original images path` | Configure a custom `output` path for your files                                                                                         |
|  **`padding`**   |      `{Number}`      |         `2px`          | padding between images                                                                                                                  |

you can set css property width and height, the sprite's `background-size` will be set according to the css property width and height, the first value of `background-size` property is `(width/imageWidth) * spriteWidth`, the second value of `background-size` property calculate as same the the second value. if you not set width and height, the element will set width and height to image's width and height.

Here's an example how to use sprites-loader
**css code**

```
div {
    background-image: url('./img/love.png?__sprite')
}

p {
    margin: 0;
    width: 32px;
    height: 32px;
    background: no-repeat url('./img/love-heart.png?__sprite');
}
```

**webpack.config.js**

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader', 'sprites-loader', 'less-loader' ]
      }
    ]
  }
}
```

**output**

```
div {
  background-image: url("img/sprite-6c7333.png");background-size:400px 200px;
background-position:-0px -0px;
width:200px;
height:200px;
 }

a {
  margin: 0;
  width: 32px;
  height: 32px;
  background: no-repeat url("img/sprite-6c7333.png");background-size:64px 32px;
background-position:-32px -0px;
 }
```

以上文档详见 [文档](https://www.npmjs.com/package/sprites-loader)

该loader在https://www.npmjs.com/package/sprites-loader 基础上修复了line-height的bug
修改内容在

```
原代码：
        "(width|height)\\s*:\\s*([0-9\\.]+px)": handleWidthOrHeight,
修改为：
        "(width|(?<!-)height)\\s*:\\s*([0-9\\.]+px)": handleWidthOrHeight,
```
