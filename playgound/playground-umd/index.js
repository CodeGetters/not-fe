// import { Promise, EventBus } from "@repo/core";
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

// let promise = new Promise((resolve, reject) => {
//   console.log("promise resolve");
//   setTimeout(() => {
//     resolve("ok");
//   }, 1000);
// });

// console.log("promise start");

// promise
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

// (() => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       reject("error");
//     }, 2000);
//   })
//     .then((res) => {
//       console.log(res);
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// })();

// const e = new EventBus();
// // 监听
// e.on("age", (age) => {
//   console.log(age, "第一个");
// });
// // 触发
// e.emit("age");
// console.log("--------------");

// Function.prototype.a = () => {
//   console.log("1");
// };

// Object.prototype.b = () => {
//   console.log("2");
// };
// function A() {}
// const a = new A();
// // console.log(a.a());
// // console.log(a.b());
// console.log(A.a());
// console.log(A.b());

// A.prototype.__proto__
// console.log(A.__proto__===Function.prototype);
// console.log(a.__proto__)
// console.log(A.__proto__.a());

// function createInstance(ctor, ...args) {
//   if (typeof ctor !== "function")
//     return console.error(
//       ctor,
//       "type " +
//         Object.prototype.toString.call(ctor).slice(8, -1).toLowerCase() +
//         " is not a constructor",
//     );

//   const instance = Object.create(ctor.prototype);
//   const ret = ctor.apply(instance, args);
//   return ret && (typeof ret === "object" || typeof ret === "function")
//     ? ret
//     : instance;
// }

// function ab(fn, time, delay) {
//   return function () {
//     let count = 0;
//     const interval = setInterval(() => {
//       fn();
//       count++;
//       if (count === time) {
//         clearInterval(interval);
//       }
//     }, delay);
//   };
// }

// const target = {
//   field1: 1,
//   field2: undefined,
//   field3: {
//     child: "child",
//   },
//   field4: [2, 4, 8],
// };

// function cloneDeep(target, map = new WeakMap()) {
//   if (typeof target === "object") {
//     let cloned = Array.isArray(target) ? [] : {};
//     if (map.has(target)) {
//     }
//     for (const key in target) {
//       cloned[key] = cloneDeep(target[key], map);
//     }
//     return cloned;
//   } else {
//     return target;
//   }
// }
// const target1 = cloneDeep(target);
// console.log(target1)

// function Foo() {
//   getName = function () {
//     console.log(1);
//   };
//   return this;
// }
// Foo.getName = function () {
//   console.log(2);
// };
// Foo.prototype.getName = function () {
//   console.log(3);
// };
// var getName = function () {
//   console.log(4);
// };
// function getName() {
//   console.log(5);
// }
// // Foo.getName();
// getName();
// Foo().getName();
// getName();
// // new Foo.getName();
// // new Foo().getName();
// new new Foo().getName();

// // Foo.getName();
// // new Foo().getName();

// var length = 10;
// function fn() {
//   return this.length + 1;
// }
// var obj = {
//   length: 5,
//   test1: function () {
//     return fn();
//   },
// };
// obj.test2 = fn;
// console.log(obj.test1()); // 11
// console.log(fn() === obj.test2()); // true

// let a = 1;
// function foo(a) {
//   return (a = a + 1);
// }
// var b = foo(2);
// function foo(a) {
//   return (a = a + 2);
// }
// const c = foo(3);
// function foo(a) {
//   return (a = a + 3);
// }
// console.log(a, b, c);

// function foo(a) {
//   return function (b) {
//     return function (c) {
//       return a + b + c;
//     };
//   };
// }

// console.log(foo(1)(2)(3));

// function curry(fn, args) {
//   const len = fn.length;
//   args = args || [];

//   return function () {
//     let _args = args.slice(0),
//       arg,
//       i;
//     for (i = 0; i < arguments.length; i++) {
//       arg = arguments[i];
//       _args.push(arg);
//     }
//     if (_args.length < len) {
//       return curry.call(this, fn, _args);
//     } else {
//       return fn.apply(this, _args);
//     }
//   };
// }

// function multiFn(a, b, c, d) {
//   return a * b * c * d;
// }

// var multi = curry(multiFn);

// console.log(multi(1)(2)(3)(4)); // 24

// function curry(fn) {
//   // curriedFn 为柯里化生产的新函数
//   // 为什么不使用匿名函数？因为如果传入参数 args.length 小于 fn 函数的形参个数 fn.length，需要重新递归
//   return function curriedFn(...args) {
//     if (args.length < fn.length) {
//       return function () {
//         // 之前传入的参数都储存在 args 中
//         // 新函数参入参数在 arguments，因为 arguments 并非真正的数组需要 Array.from() 转换成数组
//         // 递归执行，重复之前的过程
//         return curriedFn(...args.concat(Array.from(arguments)));
//       };
//     }
//     return fn(...args);
//   };
// }
// function sum(a, b, c) {
//   return a + b + c;
// }
// // 定义一个柯里化函数
// const curried = curry(sum);

// // 如果输入了全部的参数，则立即返回结果
// console.log(curried(1, 2, 3)); // 6

class Person {
  constructor() {
    this.promise = Promise.resolve();
  }
  eat(something) {
    this.promise = this.promise.then(() => {
      console.log(`eat ${something}`);
      return this;
    });
    return this;
  }
  sleep(time) {
    this.promise = this.promise.then(
      () =>
        new Promise((resolve) => {
          setTimeout(resolve, time);
        }),
    );
    return this;
  }
}

const person = new Person();
person
  .eat("breakfast")
  .sleep(1000)
  .eat("lunch")
  .sleep(2000)
  .sleep(3000)
  .eat("dinner");
