function curry(fn, ...args) {
  return (...args2) => {
    // 如果传入的参数大于等于函数需要的就执行，
    if (fn.length <= args.length + args2.length) {
      return fn(...args, ...args2);
    } else {
      // 否则继续递归生成新的函数，等待参数传递完毕
      return curry(fn, ...args, ...args2);
    }
  };
}

function sum(a, b, c, d) {
  console.log("sum", a + b + c + d);
}
const sumPlus = curry(sum);

sumPlus(1)(2)(3)(4);
sumPlus(1, 2)(3)(4);
sumPlus(1, 2, 3)(4);
sumPlus(1, 2, 3, 4);

// 无限参数
function curry2(fn, ...args) {
  return (...args2) => {
    if (args2.length === 0) {
      return fn(...args);
    } else {
      return curry2(fn, ...args, ...args2);
    }
  };
}
const sumPlus2 = curry(sum);

// 只有传递空参数才执行
sumPlus2(1)(2)(3)(4)();
sumPlus2(1, 2)(3)(4)();
sumPlus2(1, 2, 3)(4)();
sumPlus2(1, 2, 3, 4)();
