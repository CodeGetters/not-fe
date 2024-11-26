# eslint-plugin-leihuo

自定义eslint插件

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```
npm i eslint --save-dev
```

Next, install `@ccc/eslint-plugin-leihuo`:

```
npm install @ccc/eslint-plugin-leihuo --save-dev
```

## Usage

Add `leihuo` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```
{
  "extends": [
    "eslint:recommended",
    "plugin:vue/essential",
    "standard",
    "plugin:@ccc/leihuo/recommended"
  ]
}
```

开启关闭规则

```
"off" or 0 - 关闭规则
"warn" or 1 - 将规则视为一个警告（不会影响退出码）
"error" or 2 - 将规则视为一个错误 (退出码为1)

```

关闭某条rule

```
{
    "rules": {
        "@ccc/leihuo/rule-name": 'off'
    }
}
```

修改某一条rule的配置参数

```
{
    "rules": {
        "@ccc/leihuo/rule-name": [
          'error',
          xxx(根据规则配置文档修改配置参数)
        ]
    }
}
```

## Leihuo自定义Eslint Rules

### @ccc/leihuo/require-video-audio-source-type

#### Rules Details

video, audio标签，在多个source的时候，type必须明确指定

```
/* ✓ GOOD */
<video id="into" preload="auto" muted loop>
  <source src="https://qnm.v.netease.com/2023/0313/9099d13c9d06566d069705e5e6f5f83f.mp4" type="video/mp4">
  <source src="https://qnm.v.netease.com/2023/0313/9099d13c9d06566d069705e5e6f5f83f.mov" type="video/mov">
</video>

<video id="into" preload="auto" muted loop>
   <source src="https://qnm.v.netease.com/2023/0313/9099d13c9d06566d069705e5e6f5f83f.mp4" :type="videoType">
</video>

/* ✗ BAD */
<audio>
   <source src="https://qnm.v.netease.com/2023/0313/9099d13c9d06566d069705e5e6f5f83f.mp4">
</audio>
```

### @ccc/leihuo/if-else-limit

#### Rules Details

if else分支不要过多，可以通过提前return或者swith优化。

分支数可配置，默认是5

可以通过如下配置自定义

```
'@ccc/leihuo/if-else-limit': [
 'error',
 4
]
```

```
/* ✓ GOOD */
if(xxx) return
if(abc) {}

/* ✗ BAD */
if() {
} else if() {
} else if() {
} else if() {
} else {
}
```

### @ccc/leihuo/if-index-of-limit

#### Rules Details

校验if(xxx.indexOf(x)) 语法，防止索引判断问题

```
/* ✓ GOOD */
const beasts = ['ant', 'bison', 'camel', 'duck', 'bison']
if (beasts.indexOf('bison') > -1) {

}
/* ✗ BAD */
if (beasts.indexOf('bison')) {

}
```

### @ccc/leihuo/no-while-loop

#### Rules Details

禁止使用while，防止死循环

### @ccc/leihuo/timer-no-number(暂时关闭该规则)

#### Rules Details

setTimeout,setInterval第二个参数不要直接使用number, 用有意义的变量来声明

```
/* ✓ GOOD */
const refreshInterval = 1000
 window.refreshTimer = setInterval(() => {

}, refreshInterval)

/* ✗ BAD */
 window.timer1 = setTimeout(() => {

}, 1000)
```

### @ccc/leihuo/timer-require-clear

#### Rules Details

setTimeout,setInterval定时器务必清除

### @ccc/leihuo/no-window-api

#### Rules Details

限制某些window上的api使用，目前默认localStorage, sessionStorage

可以通过如下配置自定义

```
'@ccc/leihuo/no-window-api': [
      'error',
      {
        apis: ["localStorage"],
      }
]
```

同时，新增了一些保留配置，如禁止使用window.open进行连接跳转，以规避一些浏览器对于新窗口打开的拦截。
请按照提示，使用util中的newWin方法进行跳转

### @ccc/leihuo/parent-children-limit

#### Rules Details

禁止掉随意使用多级$parent $children进行组件间通信，如$parent.$parent.$children.getList()。

默认只能使用（一层）如：$parent.getList() 或者$children.getList()

Attention:
请有节制地使用 $parent 和 $children。它们的主要目的是作为访问组件的应急方法。更推荐用 props 和 events 实现父子组件通信

可以通过如下配置自定义

```
'@ccc/leihuo/parent-children-limit': [
  'error',
  1
]
```

```
/* ✓ GOOD */
// 更推荐用 props 和 events 实现父子组件通信

/* ✗ BAD */
 this.$parent.$parent.$refs.labelRef.getList()
```

### @ccc/leihuo/res-code-if-with-else

#### Rules Details

处理后台接口返回，如果有code === 1的if，else if必须要有else

```
/* ✓ GOOD */
if (res.code === CODE.SUCCESS) {

} else {

}

/* ✗ BAD */
if (res.code === CODE.SUCCESS) {

}
```

### @ccc/leihuo/no-equal-to-magic-number

#### Rules Details

不要直接 === 无意义的number，请使用常量声明一下,提高代码可读性，和降低修改维护成本

```
/* ✓ GOOD */
const xxx = 3
if(this.activityId === xxx) {}

this.step = YUYUE_STPES['login']

/* ✗ BAD */
if(this.activityId === 3) {}
```

### @ccc/leihuo/template-no-equal-to-magic-number

#### Rules Details

同上，vue template模板中也不允许使用

### @ccc/leihuo/template-directive-obj-deep-limit

#### Rules Details

限制.vue文件中的template中的v-if、v-bind、v-show的对象属性的访问深度要在3层（默认）以内

如a.b.c.d 的访问深度为3层

可以通过如下配置修改：

```
'@ccc/leihuo/template-directive-obj-deep-limit': [
    'error',
    4
]
```

```
/* ✓ GOOD */
<p v-if="aComputedObj"></p>

computed: {
  aComputedObj () {
    return (this.a && this.a.b  && this.a.b.c) ? this.a.b.c : ''
  }
},

/* ✗ BAD */
<p :abc="a.b.c.d"></p>
 <p v-if="a.b.d.e"></p>
<p v-else-if="a.b.e.g.f"></p>
```

### @ccc/leihuo/template-no-complex-condition

#### Rules Details

限制.vue文件中的template中的v-if、v-show的条件表达式不要过于长，涵盖**逻辑表达式**和**对象属性访问深度**

如：

```
<p v-if="test === 1 && a.b.d.e === 'xxx'"></p>
```

统计出来的深度为总计为6层

- test
- 1
- a.b.d.e为三层属性访问
- xxx

可以通过如下配置修改：

```
'@ccc/leihuo/template-directive-obj-deep-limit': [
    'error',
    6
]
```

```
/* ✓ GOOD */
<p v-if="aComputedCondition"></p>

computed: {
  aComputedCondition () {
    return test === 1 && a.b.d.e === 'xxx'
  }
},

/* ✗ BAD */
<p v-if="test === 1 && a.b.d.e === 'xxx'"></p>
```

### @ccc/leihuo/no-local-date（暂时默认关闭该规则）

#### Rules Details

前端禁止使用new Date进行本地时间操作，时间配置请使用服务器时间。
本地如果实在需要使用，可以通过如下配置修改.eslintrc.js：

```
'@ccc/leihuo/no-local-date': 'off',
```

### @ccc/leihuo/new-date-limit

#### Rules Details

1、前端使用new Date(xxxx) 时，只有一个参数时，必须是时间戳，并且配置在js/common/const.js中，供QA在发布系统中验证

2、new Date(res) 取自后台时会报错，需要手动和后台确认是否返回的是毫秒时间戳。如果不是，请不要使用new Date去左二次处理/联系后台改成毫秒时间戳。

确认完成后，前端通过eslint-disable-next-line忽略该行代码

3、const birthday4 = new Date(1995, 11, 17, 3, 24, 0)多个参数时，目前未发现兼容性问题，可以直接配置在const.js中

```
/* ✓ GOOD */
const birthday = new Date(628021800000); // 2023-08-10 17:15:30

/* ✗ BAD */
const birthday = new Date('628021800000');
const birthday = new Date('2023-08-10 17:15:30');
const birthday = new Date('2023/08/10 17:15:30');
```

### @ccc/leihuo/typo

#### Rules Details

一些常见错别字

```
默认：
    // 错别字: 正确字
    '登陆': '登录',
    '帐号': '账号'

```

可以通过如下配置**新增**：

```
'@ccc/leihuo/template-directive-obj-deep-limit': [
    'error',
    words: {
        '错别字': '正确字'
    }
]
```

### @ccc/leihuo/template-typo

同上，检测vue template中的上述错别字

### @ccc/leihuo/api-host-file-limit

后台接口地址必须配置在js/api/host.js中，供QA在发布系统中检查

### @ccc/leihuo/no-ua

#### Rules Details

项目中禁止使用各种关于ua的判断代码，请统一使用leihuo-util中的方法

详见文档 https://ccc-doc.leihuo.netease.com/#/doc/leihuo-util/#/

如不满足需求，请联系导师添加到leihuo-util中统一维护

### @ccc/leihuo/no-resource-space(已废弃)

#### Rules Details

js和html中出现的资源链接地址前后禁止出现空格，真机有兼容性问题

### @ccc/leihuo/template-no-resource-space（已废弃）

#### Rules Details

Vue template中的资源链接地址前后禁止出现空格，真机有兼容性问题

### @ccc/leihuo/resource-link-limit

#### Rules Details

对于页面链接，和资源链接的一些关于空格，中文，转义中文的一些限制

1、页面链接和资源链接，均不允许出现前后空格和中文
2、链接?前的部分，不允许出现转义的中文（?后和#后的参数可以是转义后的中文）
3、组内页面链接是否以/结尾（以.xxx结尾的不作限制，如.html, .ts, .mp3等）

### @ccc/leihuo/no-external-cdn

#### Rules Details

禁止使用外部cdn资源

### @ccc/leihuo/black-list

#### Rules Details

禁止使用的一些url，如六马接口等，可配置

### @ccc/leihuo/no-game-download-link

#### Rules Details

手游下载链接限制。禁止使用gdl.netease.com的现在链接。请产品走手游下载系统配置有效链接。
白名单配置项在gameDownloadLinkWiteList

### @ccc/leihuo/no-vconsole

#### Rules Details

禁止开发自行使用vconsole插件，已集成到leihuo-bmr-sdk-add-plugin webpack插件中

新老项目框架，不同配置升级方案，详见 https://ccc-doc.leihuo.netease.com/#/doc/leihuo-webpack-config-web/

## 其他外部开源Eslint Rules

## promise/catch-or-return

开启了
promise/catch-or-return 规则，限制promise的处理中，必须有catch或者return

```
/* ✓ GOOD */
  getL10ServerList().then(res => {

    }
  }).catch((msg) => {
    this.$alert(msg)
  })

  /* ✗ BAD */
  getL10ServerList().then(res => {

    }
  })
```

详见官方文档[eslint-plugin-promise](https://www.npmjs.com/package/eslint-plugin-promise)

## html的lint检查(0.1.2及以上版本)

新项目模版，会新增关于html的检查

### @ccc/leihuo/html-no-jump-with-ua

#### Rules Details

html中不允许写任何通过ua来进行跳转的代码，统一使用ccc.config.js中的jjumpLoader配置来跳转

如不满足需求，请连续开发支持

### @ccc/leihuo/html-include-check

#### Rules Details

html中<!--#include virtual="/xxx/xxx.html"-->语法检查,防止多余空格,禁止引入branch_xxx分支global include内容（分支测试地址中global include插件会自动识别）等

### @ccc/leihuo/html-include-echo-var-check

#### Rules Details

html中<!--#echo var='Download'-->语法检查,防止多余空格等

### @ccc/leihuo/html-require-video-audio-source-type

#### Rules Details

html中video, audio标签，在多个source的时候，type必须明确指定

### 其他外部开源html lint插件

目前引入如下规则： 详见[文档](https://yeonjuan.github.io/html-eslint/docs/getting-started/)

#### @html-eslint/no-duplicate-id

#### @html-eslint/require-closing-tags

## vue-scoped-css/enforce-style-type

详见官方文档[enforce-style-type](https://future-architect.github.io/eslint-plugin-vue-scoped-css/rules/enforce-style-type.html)

@ccc/leihuo自定义eslint规范，使用过程中遇到问题，请联系 hzxuli@corp.netease.com
咨询请附带代码和报错文件（以@ccc/leihuo开头）

## 开发调试工具

vue ast调试工具
https://astexplorer.net/

html ast调试工具
https://yeonjuan.github.io/es-html-parser/
