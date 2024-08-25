const Promise = require("@repo/core").Promise;
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

let promise1 = new Promise((resolve, reject) => {
  console.log("promise resolve");
  setTimeout(() => {
    resolve("ok");
  }, 1000);
});

promise1
  .then(
    (value) => {
      console.log(value);
      return "1";
    },
    (error) => {
      console.log(error);
    },
  )
  .then((res) => {
    console.log("finally", res);
  });

let promise2 = new Promise((resolve, reject) => {
  resolve("ok");
}).then((res) => {
  console.log(res);
});

console.log(Promise.all([promise1, promise2]));
