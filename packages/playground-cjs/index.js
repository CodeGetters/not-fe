// const Promise = require("@repo/core").Promise;
// let promise = new Promise((resolve, reject) => {
//   console.log("promise resolve");
//   // resolve("ok");
// });

// console.log("promise start");

// promise.then(
//   (value) => {
//     console.log(value);
//   },
//   (error) => {
//     console.log(error);
//   },
// );
// (() => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log("promise resolve");
//     }, 1000);
//     resolve("ok");
//   }).then((res) => {
//     console.log(res);
//   });
// })();

// let promise1 = new Promise((resolve, reject) => {
//   console.log("promise resolve");
//   setTimeout(() => {
//     resolve("ok");
//   }, 1000);
// });

// promise1
//   .then(
//     (value) => {
//       console.log(value);
//       return "1";
//     },
//     (error) => {
//       console.log(error);
//     },
//   )
//   .then((res) => {
//     console.log("finally", res);
//   });

// let promise2 = new Promise((resolve, reject) => {
//   resolve("ok");
// }).then((res) => {
//   console.log(res);
// });

// console.log(Promise.all([promise1, promise2]));

// 模仿一个fetch的异步函数，返回promise
// function mockFetch(param) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(param);
//     }, 2000);
//   });
// }

// function limitedRequest(urls, maxNum) {
//   const pool = [];
//   const initSize = Math.min(urls.length, maxNum);
//   for (let i = 0; i < initSize; i++) {
//     pool.push(run(urls.splice(0, 1)));
//   }
//   function r() {
//     console.log("当前并发度：", pool.length);
//     if (urls.length === 0) {
//       console.log("并发请求已经全部发起");
//       return Promise.resolve();
//     }
//     return run(urls.splice(0, 1));
//   }
//   function run(url) {
//     return mockFetch(url).then(r);
//   }
//   Promise.all(pool).then(() => {
//     console.log("请求已经全部结束");
//   });
// }
// // 函数调用
// limitedRequest([1, 2, 3, 4, 5, 6, 7, 8], 3);

function get(object, path, defaultValue) {
  // 判断 object 是否是数组或者对象，否则直接返回默认值 defaultValue
  if (typeof object !== "object") return defaultValue;
  // 沿着路径寻找到对应的值，未找到则返回默认值 defaultValue
  return _basePath(path).reduce((o, k) => (o || {})[k], object) || defaultValue;
}

// 处理 path， path有三种形式：'a[0].b.c'、'a.0.b.c' 和 ['a','0','b','c']，需要统一处理成数组，便于后续使用
function _basePath(path) {
  // 若是数组，则直接返回
  if (Array.isArray(path)) return path;
  // 若有 '[',']'，则替换成将 '[' 替换成 '.',去掉 ']'
  return path.replace(/\[/g, ".").replace(/\]/g, "").split(".");
}

function myGet(obj, path, defaultValue = undefined) {
  if (typeof path === "string") {
    path = path
      .replace(/([\[\]])/g, ($1) => {
        return $1 === "[" ? "." : "";
      })
      .split(".");
  }

  if (
    !obj ||
    typeof obj !== "object" ||
    !Array.isArray(path) ||
    path.length === 0
  ) {
    return path.length === 0 ? obj : defaultValue;
  }

  let target = obj;
  for (const item of path) {
    target = target[item];
    if (!target) break;
  }

  return target || defaultValue;
}

function get(object, pathParam, defaultValue) {
  if (object == null) {
    return defaultValue;
  }

  let count = 0;

  const path = Array.isArray(pathParam) ? pathParam : pathParam.split(".");
  const length = path.length;

  while (object != null && count < length) {
    object = object[String(path[count])];
    count += 1;
  }

  const result = count && count === length ? object : undefined;

  return result === undefined ? defaultValue : result;
}

class HelloPlugin {
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options) {}
  // Webpack 会调用 HelloPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler) {
    // 在emit阶段插入钩子函数，用于特定时机处理额外的逻辑；
    compiler.hooks.emit.tap("HelloPlugin", (compilation) => {
      // 在功能流程完成后可以调用 webpack 提供的回调函数；
    });
    // 如果事件是异步的，会带两个参数，第二个参数为回调函数，在插件处理完任务时需要调用回调函数通知webpack，才会进入下一个处理流程。
    compiler.plugin("emit", function (compilation, callback) {
      // 支持处理逻辑
      // 处理完毕后执行 callback 以通知 Webpack
      // 如果不执行 callback，运行流程将会一直卡在这不往下执行
      callback();
    });
  }
}

module.exports = HelloPlugin;
