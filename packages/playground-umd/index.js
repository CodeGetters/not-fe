// // import { Promise, EventBus } from "@repo/core";
// // let promise = new Promise((resolve, reject) => {
// //   console.log("promise resolve");
// //   // resolve("ok");
// // });

// // console.log("promise start");

// // promise.then(
// //   (value) => {
// //     console.log(value);
// //   },
// //   (error) => {
// //     console.log(error);
// //   },
// // );
// // (() => {
// //   return new Promise((resolve, reject) => {
// //     setTimeout(() => {
// //       console.log("promise resolve");
// //     }, 1000);
// //     resolve("ok");
// //   }).then((res) => {
// //     console.log(res);
// //   });
// // })();

// // let promise = new Promise((resolve, reject) => {
// //   console.log("promise resolve");
// //   setTimeout(() => {
// //     resolve("ok");
// //   }, 1000);
// // });

// // console.log("promise start");

// // promise
// //   .then(
// //     (value) => {
// //       console.log(value);
// //       return "1";
// //     },
// //     (error) => {
// //       console.log(error);
// //     },
// //   )
// //   .then((res) => {
// //     console.log("finally", res);
// //   });

// // (() => {
// //   return new Promise((resolve, reject) => {
// //     setTimeout(() => {
// //       resolve("ok");
// //       reject("error");
// //     }, 2000);
// //   }).then((res) => {
// //     console.log(res);
// //   });
// // })();

// // const e = new EventBus();
// // // 监听
// // e.on("age", (age) => {
// //   console.log(age, "第一个");
// // });
// // // 触发
// // e.emit("age");
// // console.log("--------------");

// // Function.prototype.a = () => {
// //   console.log("1");
// // };

// // Object.prototype.b = () => {
// //   console.log("2");
// // };
// // function A() {}
// // const a = new A();
// // // console.log(a.a());
// // // console.log(a.b());
// // console.log(A.a());
// // console.log(A.b());

// // A.prototype.__proto__
// // console.log(A.__proto__===Function.prototype);
// // console.log(a.__proto__)
// // console.log(A.__proto__.a());

// // function createInstance(ctor, ...args) {
// //   if (typeof ctor !== "function")
// //     return console.error(
// //       ctor,
// //       "type " +
// //         Object.prototype.toString.call(ctor).slice(8, -1).toLowerCase() +
// //         " is not a constructor",
// //     );

// //   const instance = Object.create(ctor.prototype);
// //   const ret = ctor.apply(instance, args);
// //   return ret && (typeof ret === "object" || typeof ret === "function")
// //     ? ret
// //     : instance;
// // }

// // function ab(fn, time, delay) {
// //   return function () {
// //     let count = 0;
// //     const interval = setInterval(() => {
// //       fn();
// //       count++;
// //       if (count === time) {
// //         clearInterval(interval);
// //       }
// //     }, delay);
// //   };
// // }

// // const target = {
// //   field1: 1,
// //   field2: undefined,
// //   field3: {
// //     child: "child",
// //   },
// //   field4: [2, 4, 8],
// // };

// // function cloneDeep(target, map = new WeakMap()) {
// //   if (typeof target === "object") {
// //     let cloned = Array.isArray(target) ? [] : {};
// //     if (map.has(target)) {
// //     }
// //     for (const key in target) {
// //       cloned[key] = cloneDeep(target[key], map);
// //     }
// //     return cloned;
// //   } else {
// //     return target;
// //   }
// // }
// // const target1 = cloneDeep(target);
// // console.log(target1)

// // function Foo() {
// //   getName = function () {
// //     console.log(1);
// //   };
// //   return this;
// // }
// // Foo.getName = function () {
// //   console.log(2);
// // };
// // Foo.prototype.getName = function () {
// //   console.log(3);
// // };
// // var getName = function () {
// //   console.log(4);
// // };
// // function getName() {
// //   console.log(5);
// // }
// // // Foo.getName();
// // getName();
// // Foo().getName();
// // getName();
// // // new Foo.getName();
// // // new Foo().getName();
// // new new Foo().getName();

// // // Foo.getName();
// // // new Foo().getName();

// // var length = 10;
// // function fn() {
// //   return this.length + 1;
// // }
// // var obj = {
// //   length: 5,
// //   test1: function () {
// //     return fn();
// //   },
// // };
// // obj.test2 = fn;
// // console.log(obj.test1()); // 11
// // console.log(fn() === obj.test2()); // true

// // let a = 1;
// // function foo(a) {
// //   return (a = a + 1);
// // }
// // var b = foo(2);
// // function foo(a) {
// //   return (a = a + 2);
// // }
// // const c = foo(3);
// // function foo(a) {
// //   return (a = a + 3);
// // }
// // console.log(a, b, c);

// function race(promises) {
//   return new Promise((resolve, reject) => {
//     promises.map((item) => {
//       Promise.resolve(item).then(resolve, reject);
//     });
//   });
// }
// function all(promises) {
//   return new Promise((resolve, reject) => {
//     const res = [];
//     promises.map((item, i) => {
//       Promise.resolve(item).then((val) => {
//         res[i] = val;
//         if (i === promises.length) return res;
//       });
//     }, reject);
//   });
// }
// function allSettled() {}
