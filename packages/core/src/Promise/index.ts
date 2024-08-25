enum STATUS {
  REJECTED = "REJECTED",
  FULFILLED = "FULFILLED",
  PENDING = "PENDING",
}

class Promise {
  status: STATUS;
  value: any;
  reason: any;
  onResolveCall: Function[];
  onRejectCall: Function[];

  constructor(executor) {
    this.status = STATUS.PENDING;
    this.reason = undefined;
    this.value = undefined;
    this.onResolveCall = [];
    this.onRejectCall = [];
    /**
     * 创建Promise需要立即执行
     * 状态只有在失败或者成功的时候才会更改
     * 状态修改不可逆
     */
    let resolve = (value) => {
      if (this.status === STATUS.PENDING) {
        this.status = STATUS.FULFILLED;
        this.value = value;
        // 依次执行 onResolveCall 中的函数
        this.onResolveCall.forEach((fn) => fn());
      }
    };
    let reject = (reason) => {
      if (this.status === STATUS.REJECTED) {
        this.status = STATUS.REJECTED;
        this.reason = reason;
        // 依次执行 onRejectCall 中的函数
        this.onRejectCall.forEach((fn) => fn());
      }
    };
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  #resolveThen(newPromise, x, resolve, reject) {
    /**
     * 返回值可能是一个普通值或者是一个 Promise
     * 所以需要判断并分别进行处理
     * 如果返回值是 Promise,如果其同时调用resolve和reject,则直接返回第一个即可
     * 如果返回值是 Promise,则调用它的then方法
     */
    if (newPromise === x)
      return reject(
        new TypeError(
          "由于then和 onFulfilled 的返回值是同一个引用对象,造成了循环引用",
        ),
      );
    // 只执行第一次调用
    let called: boolean;
    if ((typeof x === "object" && x !== null) || typeof x === "function") {
      try {
        const promiseThen = x.then;
        if (typeof promiseThen === "function") {
          promiseThen.call(
            x,
            (newResolve) => {
              if (called) return;
              called = true;
              resolve(newResolve);
            },
            (newReject) => {
              if (called) return;
              called = true;
              reject(newReject);
            },
          );
        } else {
          if (called) return;
          called = true;
          reject(x);
        }
      } catch (error) {
        reject(error);
      }
    } else {
      resolve(x);
    }
  }
  then(onFulfilled: (value) => void, onRejected: (reason) => void) {
    // then 的参数可以缺省
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function" ? onRejected : (reason) => reason;

    // 每次调用 then 时，会创建一个新的 Promise 对象
    const newPromise = new Promise((resolve, reject) => {
      /**
       * setTimeout: 模拟异步执行then的回调,避免在then方法返回之前改变状态
       * resolveThen：处理返回值并根据返回值决定下一个Promise的状态
       */
      if (this.status === STATUS.FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            this.#resolveThen(newPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      if (this.status === STATUS.REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            this.#resolveThen(newPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      if (this.status === STATUS.PENDING) {
        this.onResolveCall.push(() => {
          try {
            const x = onFulfilled(this.value);
            this.#resolveThen(newPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
        this.onRejectCall.push(() => {
          try {
            const x = onRejected(this.reason);
            this.#resolveThen(newPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
      return newPromise;
    });
  }
  catch(reason) {}
}

export default Promise;
