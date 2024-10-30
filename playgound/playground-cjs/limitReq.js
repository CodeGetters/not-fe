// // 这是一个请求函数
// function request(value) {
//   // 模拟一个异步请求
//   return new Promise((resolve) => setTimeout(() => resolve(value), 1000));
// }

// function limitedReq(promises, max) {
//   if (!Array.isArray(promises)) {
//     throw new TypeError("promises must be an array");
//   }

//   const len = promises.length;
//   const initSize = Math.min(len, max);
//   const pool = [];
//   const result = [];

//   for (let i = 0; i < initSize; i++) {
//     pool.push(run());
//   }

//   function run() {
//     if (promises.length === 0) {
//       return Promise.resolve();
//     }

//     const req = promises.shift();
//     return request(req)
//       .then((res) => {
//         result.push(res);
//         return run();
//       })
//       .catch((err) => {
//         console.error("请求失败:", err);
//         return run();
//       });
//   }

//   return Promise.all(pool).then(() => {
//     console.log("执行完毕...");
//     return result
//   });
// }

// // 示例调用
// const promises = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// limitedReq(promises, 2).then((res) => {
//   console.log(res);
// });

// /**
//  * promise并发限制调用
//  * @param {object[]} data - 调用的数据列表
//  * @param {number} maxLimit - 并发调用限制个数
//  * @param {function} iteratee - 处理单个节点的方法
//  * @returns {promise}
//  */
// export function promiseLimitPool(
//   { data = [], maxLimit = 3, iteratee = () => {} } = {},
//   callback = () => {},
// ) {
//   const executing = [];
//   const enqueue = (index = 0) => {
//     // 边界处理
//     if (index === data.length) {
//       return Promise.all(executing);
//     }
//     // 每次调用enqueue, 初始化一个promise
//     const item = data[index];

//     function itemPromise(index) {
//       const promise = new Promise(async (resolve) => {
//         // 处理单个节点
//         await iteratee({ index, item: cloneDeep(item), data: cloneDeep(data) });
//         resolve(index);
//       }).then(() => {
//         // 执行结束，从executing删除自身
//         const delIndex = executing.indexOf(promise);
//         delIndex > -1 && executing.splice(delIndex, 1);
//       });
//       return promise;
//     }
//     // 插入executing数字，表示正在执行的promise
//     executing.push(itemPromise(index));

//     // 使用Promise.rece，每当executing数组中promise数量低于maxLimit，就实例化新的promise并执行
//     let race = Promise.resolve();

//     if (executing.length >= maxLimit) {
//       race = Promise.race(executing);
//     }

//     // 递归，直到遍历完
//     return race.then(() => enqueue(index + 1));
//   };

//   return enqueue();
// }

// 示例
// promiseLimitPool({
//   data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
//   maxLimit: 2,
//   iteratee: async ({ item }) => {
//     console.log("onClick -> item", item);
//     await Axios({
//       method: "get",
//       url: `API接口地址`,
//       params: { page: 0, size: 9 },
//     });
//   },
// });
function limitConcurrency(requests, maxConcurrency) {
  const results = new Array(requests.length);
  let activeCount = 0;
  const queue = [];

  function handleRequest(index, retries = 3) {
    activeCount++;
    requests[index]()
      .then((result) => {
        results[index] = result;
        activeCount--;
        if (queue.length > 0) {
          const nextIndex = queue.shift();
          handleRequest(nextIndex);
        }
      })
      .catch((error) => {
        if (retries > 0) {
          handleRequest(index, retries - 1);
        } else {
          results[index] = error;
          activeCount--;
          if (queue.length > 0) {
            const nextIndex = queue.shift();
            handleRequest(nextIndex);
          }
        }
      });
  }

  for (let i = 0; i < requests.length; i++) {
    if (activeCount < maxConcurrency) {
      handleRequest(i);
    } else {
      queue.push(i);
    }
  }

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (activeCount === 0 && queue.length === 0) {
        clearInterval(interval);
        resolve(results);
      }
    }, 50);
  });
}

// 示例请求函数
const request = (id) => () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      // if (Math.random() > 0.7) {
      //   reject(`Error in request ${id}`);
      // } else {
      //   resolve(`Result of request ${id}`);
      // }
      resolve(`Result of request ${id}`);
    }, 1000);
  });

// 创建请求数组
// const requests = Array.from({ length: 10 }, (_, i) => request(i));

// // 调用函数
// limitConcurrency(requests, 3).then((results) => {
//   console.log(results);
// });
// function limitConcurrency(requests, maxConcurrency) {
//   const results = new Array(requests.length);
//   let activeCount = 0;
//   const queue = [];
//   let resolveFinal;

//   function handleRequest(index, retries = 3) {
//     activeCount++;
//     requests[index]()
//       .then((result) => {
//         results[index] = result;
//         activeCount--;
//         processQueue();
//       })
//       .catch((error) => {
//         if (retries > 0) {
//           handleRequest(index, retries - 1);
//         } else {
//           results[index] = error;
//           activeCount--;
//           processQueue();
//         }
//       });
//   }

//   function processQueue() {
//     if (queue.length > 0 && activeCount < maxConcurrency) {
//       const nextIndex = queue.shift();
//       handleRequest(nextIndex);
//     } else if (activeCount === 0 && queue.length === 0) {
//       resolveFinal(results);
//     }
//   }

//   for (let i = 0; i < requests.length; i++) {
//     if (activeCount < maxConcurrency) {
//       handleRequest(i);
//     } else {
//       queue.push(i);
//     }
//   }

//   return new Promise((resolve) => {
//     resolveFinal = resolve;
//     if (activeCount === 0 && queue.length === 0) {
//       resolve(results);
//     }
//   });
// }

// // 示例请求函数
// const request = (id) => () =>
//   new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (Math.random() > 0.7) {
//         reject(`Error in request ${id}`);
//       } else {
//         resolve(`Result of request ${id}`);
//       }
//     }, 1000);
//   });

// // 创建请求数组
// const requests = Array.from({ length: 10 }, (_, i) => request(i));

// // 调用函数
// limitConcurrency(requests, 5).then((results) => {
//   console.log(results);
// });

function all(promise) {
  if (!Array.isArray(promise)) {
    return TypeError("");
  }
  return new Promise((resolve, reject) => {
    const len = promise.length;
    const res = [];
    for (let i = 0; i < len; i++) {
      Promise.resolve(promise[i]).then((task) => {
        res[i] = task;
        if (len - 1 === i) {
          resolve(res);
        }
      }, reject);
    }
  });
}
function race(promise) {
  if (!Array.isArray(promise)) {
    return TypeError("");
  }
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promise.length; i++) {
      Promise.resolve(resolve, reject);
    }
  });
}
