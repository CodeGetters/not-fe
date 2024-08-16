export enum STATUS {
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
      }
    };
    let reject = (reason) => {
      if (this.status === STATUS.REJECTED) {
        this.status = STATUS.REJECTED;
        this.reason = reason;
      }
    };
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(onFulfilled, onRejected) {
    if (this.status === STATUS.FULFILLED) {
      onFulfilled(this.value);
    }
    if (this.status === STATUS.REJECTED) {
      onRejected(this.reason);
    }
    if (this.status === STATUS.PENDING) {
    }
  }
  catch(reason) {}
}

export default Promise;

let promise = new Promise((resolve, reject) => {
  console.log("promise resolve");
  resolve("ok");
});

console.log("promise start");

promise.then(
  (value) => {
    console.log(value);
  },
  (error) => {
    console.log(error);
  },
);
