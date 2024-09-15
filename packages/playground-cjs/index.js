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
