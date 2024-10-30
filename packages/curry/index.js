// apply version
function curry1(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}

// or --- bind and apply version
function curry2(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return curried.bind(this, ...args);
    }
  };
}

// or --- no apply/bind version
function curry3(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...args2) => curried(...args, ...args2);
  };
}

// or --- call version
function curry4(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.call(this, ...args);
    } else {
      return function (...args2) {
        return curried.call(this, ...args, ...args2);
      };
    }
  };
}

// e.g.
function sum(a, b, c) {
  return a + b + c;
}

const curriedSum = curry4(sum);

console.log(curriedSum(1)(2)(3)); // 6
console.log(curriedSum(1)(2, 3)); // 6
console.log(curriedSum(1, 2)(3)); // 6
console.log(curriedSum(1, 2, 3)); // 6
