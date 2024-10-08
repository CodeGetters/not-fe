// 模仿一个fetch的异步函数，返回promise
function mockFetch(param) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(param);
    }, 2000);
  });
}

function limitedRequest(urls, maxNum) {
  const pool = [];
  const initSize = Math.min(urls.length, maxNum);
  for (let i = 0; i < initSize; i++) {
    pool.push(run(urls.splice(0, 1)));
  }
  function r() {
    console.log("当前并发度：", pool.length);
    if (urls.length === 0) {
      console.log("并发请求已经全部发起");
      return Promise.resolve();
    }
    return run(urls.splice(0, 1));
  }
  function run(url) {
    return mockFetch(url).then(r);
  }
  Promise.all(pool).then(() => {
    console.log("请求已经全部结束");
  });
}

limitedRequest([1, 2, 3, 4, 5, 6, 7, 8], 3);
