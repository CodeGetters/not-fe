# leihuo-jump-loader

leihuo-jump-loader

## 参数

- env (环境类型)
  - dev
  - release
- isH5 (是否是H5防屏蔽链接, 默认false)
  - H5地址规则, /h5/yyyyMMdd/xxxx/
    PC: abcd
    移动：abcdm
    横板：abcdmh
- type ( <b>模板类型, 默认值: 3in1</b> ):

  - 3in1 // 三合一，PC到M，M到PC，MH判断UA（PC打开去PC，非UA去M）
  - 2in1 // 二合一，PC到M，M到PC，MH判断UA（PC打开去PC，非UA去M）
  - custom // 自定义规则

- ua ( <b>默认值: 'l12webview|l10webView|nshwebView'</b> ):

  - l10webview // MH判断UA用
  - l12webview // MH判断UA用
  - l10webview|l12webview|l15webview // 多个UA

- removeLocalUAJump ( <b>默认值: false</b> ):

  - 加removeLocalUAJump参数可以在本地环境去掉了横版的ua判断，所以非符合的ua或者PC端都能正常浏览横版页面mh，而不会跳转

- entry ( <b>默认值: [0,1]</b> ):

  - 仅当type为'2in1'时生效，0,1,2分别表示pc,m,mh, 这个参数表示2in1的双端类型，比如填[0,1]后，loader将不会增加任何去mh的跳转代码

- customRules ( <b>自定义规则, 默认值: 没有</b> ):
  1. ua
     - !/iphone|ios|android|mobile // 不是手机的话跳转
     - l10webview|l12webview|l15webview // 是内置浏览器的话跳转
     - ...按照规则写
  2. from ( <b>从哪来</b> ):
     - 'm'
     - 'pc'
     - 'mh
  3. to ( <b>跳转去哪</b> ):
     - 'm'
     - 'pc'
     - 'mh
     - 'http://abc.163.com:9030/mh/#/' // 自定义网址，要带http(s)头

## 示例

### 普通

```javascript
{
    test: /\.html$/,
    use: [{
        loader: 'leihuo-jump-loader',
        options: {
            type: '3in1',
            ua: 'l10webview',   // 可以不填写，默认'l12webview|l10webView|nshwebView'
            removeLocalUAJump: true  // 默认false, 即本地和线上一样去检测ua判断跳转
        }
    }]
}
```

### 2in1，只有横版和PC端

```javascript
{
    test: /\.html$/,
    use: [{
        loader: 'leihuo-jump-loader',
        options: {
            type: '2in1',
            entry: [0,2],   // 可以不填写，默认[0,1]
        }
    }]
}
```

### 防屏蔽链接

```js
{
  test: /\.html$/,
  use: [
    {
      loader: 'leihuo-jump-loader',
      options: {
        type: '2in1',
        entry: [0,2],   // 可以不填写，默认[0,1]
        isH5: true // h5/yyyyMMdd/xxx/ only
      }
    }
  ]
}
```

### custom

```javascript
{
    test: /\.html$/,
    use: [{
        loader: 'leihuo-jump-loader',
        options: {
            type: 'custom',
            customRules: [{
                // ua不是123456的话从PC跳转去M
                ua: '!123456',
                from: 'pc',
                to: 'm'
            },{
                // ua是123456的话从M跳转去MH
                ua: '123456',
                from: 'm',
                to: 'mh'
            },{
                // ua是123456的话从从M跳转去自定义网址
                ua: '123456',
                from: 'm',
                to: 'http://abc.163.com:9030/mh/#/'
            }]
        }
    }]
}
```

## 更新

### 2020-09-10

1. 修复client下自定义多目录PC未加跳转的BUG

### 2020-07-30

1. 修复2in1中入口为[0,2]的BUG

### 2020-05-28

1. url里面有?from=mobile或者?from=desktop的话，就不做跳转

### 2020-05-27

1. 修复mh跳PC会中转m的问题

### 2020-05-25

1. 修复/mxxx/m/, /mhxxx/mh/的跳转问题

### 2020-05-21

1. 修复m/index.html的跳转问题

### 2020-03-26

1. 增加横板页面的ipados判断，ua为/macintosh/ && !/chrome|safari/不跳转

### 2020-03-05

1. 增加正式环境强制跳HTTPS

### 2019

1. 修复逆水寒默认2in1会去mh的问题
2. 加removeLocalUAJump参数
3. 支持非index.html的跳转和自定义的文件夹命名（需要使用custom的模式）
4. 增加规则：游戏浏览器UA 跳内置版本
5. 增加2in1模式
