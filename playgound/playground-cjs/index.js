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

// 范例
const object = { a: [{ b: { c: 3 } }] };

//=> 3
// get(object, "a[0].b.c");
// console.log("1.", get(object, "a[0].b.c"));
// console.log("2.", get(object, ["a", "0", "b", "c"]));
//=> 3
get(object, 'a[0]["b"]["c"]');
console.log("3.", get(object, 'a[0]["b"]["c"]'));

//=> 'default'
// get(object, "a[100].b.c", "default");
// console.log("4.", get(object, "a[100].b.c", "default"));

function get(object, pathParam, defaultValue) {
  if (object == null) {
    return defaultValue;
  }
  let count = 0;
  const path = Array.isArray(pathParam)
    ? pathParam
    : pathParam.split(/[\.\[\]\"\']/).filter(Boolean);
  console.log("--------path--------", path);
  const length = path.length;
  while (object != null && count < length) {
    object = object[String(path[count])];
    count++;
  }
  const result = count && count === length ? object : undefined;
  return result === undefined ? defaultValue : result;
}

// 模仿一个fetch的异步函数，返回promise
// function mockFetch(param) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(param);
//     }, 2000);
//   });
// }

// function limitedReq(requests, maxNum) {
//   const pool = [];
//   const initSize = Math.min(requests.length, maxNum);
//   for (let i = 0; i < initSize; i++) {
//     pool.push(run(requests.slice(0, 1)));
//   }
//   Promise.all(pool).then(() => {
//     console.log("全部已经执行完毕...");
//   });

//   function run(req) {
//     return mockFetch(req).then(() => {
//       console.log("当前并发度：", pool.length);
//       if (requests.length === 0) {
//         console.log("并发请求已经全部发起");
//         return Promise.resolve();
//       }
//       return run(requests.splice(0, 1));
//     });
//   }
// }
// limitedReq([1, 2, 3, 4, 5, 6, 7, 8], 3);
let data = [
  { id: 0, parentId: null, name: "生物" },
  { id: 1, parentId: 0, name: "动物" },
  { id: 2, parentId: 0, name: "植物" },
  { id: 3, parentId: 0, name: "微生物" },
  { id: 4, parentId: 1, name: "哺乳动物" },
  { id: 5, parentId: 1, name: "卵生动物" },
  { id: 6, parentId: 2, name: "种子植物" },
  { id: 7, parentId: 2, name: "蕨类植物" },
  { id: 8, parentId: 4, name: "大象" },
  { id: 9, parentId: 4, name: "海豚" },
  { id: 10, parentId: 4, name: "猩猩" },
  { id: 11, parentId: 5, name: "蟒蛇" },
  { id: 12, parentId: 5, name: "麻雀" },
];

function transTree(data) {
  let result = [];
  const map = {};
  if (!Array.isArray(data)) return [];
  data.forEach((item) => {
    map[item.id] = item;
  });
  data.forEach((item) => {
    const parent = map[item.parentId];
    if (parent) {
      if (parent.children) {
        parent.children.push(item);
      } else {
        parent.children = [item];
      }
    } else {
      result.push(item);
    }
  });
  return result;
}
console.log(transTree(data));

const array = [
  {
    code: 101,
    name: "北京",
  },
  {
    code: 102,
    name: "石家庄",
  },
  {
    code: 102,
    name: "江苏",
    children: [
      {
        code: 102,
        name: "南京",
      },
      {
        code: 102,
        name: "连云港",
      },
    ],
  },
];
function toObj(arr) {
  let obj = {};
  for (let item of arr) {
    if (item["children"] !== undefined) {
      obj = { ...toObj(item["children"]), ...obj };
    } else {
      obj[item.name] = item;
    }
  }
  return obj;
}

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    } else {
      return function (...moreArgs) {
        return curried(...args, ...moreArgs);
      };
    }
  };
}

function add(a, b, c) {
  return a + b + c;
}
const curriedAdd = curry(add);
console.log("curry", curriedAdd(1)(2, 3));

function reverseStr(str) {
  if (typeof str !== "string") {
    return str;
  }
  const len = str.length;
  if (len <= 1) {
    return str;
  }
  let newStr = "",
    res = "";
  // for (let i = 0; i < len; i++) {
  //   if (str[i] !== " " && str[i] !== ".") {
  //     newStr += str[i];
  //   } else {
  //     if (newStr !== "") {
  //       res = res + newStr.split("").reverse().join("") + str[i];
  //       newStr = "";
  //     } else {
  //       res += str[i];
  //     }
  //   }
  // }
  const newStrArr = str.split(".");
  for (let i = 0; i < newStrArr.length; i++) {
    if (newStrArr[i] && newStrArr[i] !== " ") {
      res += newStrArr[i].split("").reverse().join("");
    } else {
      newStrArr[i] === "" ? (res += ".") : (res += " ");
    }
  }
  return res;
}

console.log(reverseStr("..abc...123.."));

function myInstanceOf(left, right) {
  if ((typeof left !== "object" && typeof left !== "function") || left === null)
    return false;

  // 获取 left 的原型
  let proto = Object.getPrototypeOf(left);
  // 获取 right 的 prototype 属性
  let prototype = right.prototype;
  // 循环遍历原型链
  while (true) {
    // 如果到达原型链顶端仍未找到匹配，返回 false
    if (!proto) return false;
    // 如果找到匹配的原型，返回 true
    if (proto === prototype) return true;
    // 继续向上查找原型链
    proto = Object.getPrototypeOf(proto);
  }
}

const obj = {};

console.log(myInstanceOf(obj, Object));

class EventBus {
  constructor() {
    this.events = {};
  }
  on(eventName, eventFn) {
    const eventFns = this.events[eventName];
    if (!eventFns) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(eventFn);
  }
  off(eventName, eventFn) {
    const eventFns = this.events[eventName];
    if (!eventFns) return;
    for (let i = 0; i < eventFns.length; i++) {
      if (eventFns[i] === eventFn) {
        eventFns.splice(i, 1);
        break;
      }
    }
    if (eventFns.length === 0) {
      delete this.eventFns[eventName];
    }
  }
  emit(eventName, ...args) {
    const eventFns = this.events[eventName];
    if (!eventFns) return;
    eventFns.forEach((fn) => fn(...args));
  }
}

console.log(parseInt("10+15", 2));

let a = 1;
function fn(f = () => 1) {
  let a = 2;
  console.log(f());
}
fn();

let obj1 = {
  value: "111",
};

let obj2 = {
  value: "222",
};

function changeObj(obj) {
  obj.value = "333";
  obj = obj2;
  return obj.value;
}
console.log(changeObj(obj1));
console.log(obj1.value);
