const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";
const PENDING = "PENDING";

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.reason = undefined;
    this.value = undefined;
    this.onResolvedCallback = [];
    this.onRejectedCallback = [];

    let resolve = (value) => {
      if (value instanceof Promise) {
        return value.then(resolve, reject);
      }
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onResolvedCallback.forEach((fn) => fn());
      }
    };

    let reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallback.forEach((fn) => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(onFulFilled, onRejected) {
    onFulFilled = typeof onFulFilled === "function" ? onFulFilled : (v) => v;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (error) => {
            throw error;
          };
    let newPromise = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulFilled(this.value);
            resolvePromise(newPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(newPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      if (this.status === PENDING) {
        this.onResolvedCallback.push(() => {
          setTimeout(() => {
            try {
              let x = onFulFilled(this.value);
              resolvePromise(newPromise, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        this.onRejectedCallback.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(newPromise, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });
    return newPromise;
  }
  static resolve(value) {
    return new Promise((resolve) => {
      resolve(value);
    });
  }
  static reject(reason) {
    return new Promise((_, reject) => {
      reject(reason);
    });
  }
  static all(promises) {
    if (!Array.isArray(promises)) return new TypeError("...");
    return new Promise((resolve, reject) => {
      const res = [];
      let counter = 0;
      const processResultByKey = (value, index) => {
        res[index] = value;
        if (++counter === promises.length) {
          resolve(res);
        }
      };

      for (let i = 0; i < promises.length; i++) {
        if (promises[i] && typeof promises[i].then === "function") {
          promises[i].then((value) => {
            processResultByKey(value, i);
          }, reject);
        } else {
          processResultByKey(promises[i], i);
        }
      }
    });
  }
  static race(promises) {
    if (!Array.isArray(promises)) return new TypeError("...");
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        if (promises[i] && typeof promises[i].then === "function") {
          promises[i].then(resolve, reject);
        } else {
          resolve(promises[i]);
        }
      }
    });
  }
  static allSettled(promises) {
    if (!Array.isArray(promises)) return new TypeError("...");
    return new Promise((resolve, reject) => {
      const res = [];
      let counter = 0;
      for (let i = 0; i < promises.length; i++) {
        Promise.resolve(promises[i])
          .then((value) => {
            res[i] = { status: FULFILLED, value };
          })
          .catch((reason) => {
            res[i] = { status: REJECTED, reason };
          })
          .finally(() => {
            counter++;
            if (counter === promises.length) resolve(res);
          });
      }
    });
  }
  catch(errorCallback) {
    return this.then(null, errorCallback);
  }
  finally(callback) {
    return this.then(
      (value) => {
        return Promise.resolve(callback()).then(() => value);
      },
      (reason) => {
        return Promise.reject(callback()).then(() => reason);
      },
    );
  }
}

function resolvePromise(newPromise, x, resolve, reject) {
  if (newPromise === x) return reject(new TypeError("..."));
  let called;
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    try {
      let then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(newPromise, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          },
        );
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}
