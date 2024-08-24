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

    let resolve = (value) => {
      if (this.status === STATUS.PENDING) {
        this.status = STATUS.FULFILLED;
        this.value = value;
        this.onResolveCall.forEach((fn) => fn());
      }
    };
    let reject = (reason) => {
      if (this.status === STATUS.REJECTED) {
        this.status = STATUS.REJECTED;
        this.reason = reason;
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
    if (newPromise === x)
      return reject(new TypeError("This is a circular reference"));
    let called: boolean;
    if ((typeof x === "object" && x !== null) || typeof x === "function") {
      try {
        if (typeof x.then === "function") {
        } else {
          reject(x);
        }
      } catch (error) {
        reject(error);
      }
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
      if (this.status === STATUS.FULFILLED) {
        setTimeout(() => {
          try {
            // 获取返回值并调用方法根据返回值的类型调用进行处理
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
            // onRejected(this.reason);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      if (this.status === STATUS.PENDING) {
        this.onResolveCall.push(() => {
          try {
            // onFulfilled(this.value);
          } catch (error) {
            reject(error);
          }
        });
        this.onRejectCall.push(() => {
          try {
            // onRejected(this.reason);
          } catch (error) {
            reject(error);
          }
        });
      }
    });
  }
  catch(reason) {}
}

export default Promise;
