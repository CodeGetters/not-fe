import Promise, { STATUS } from "../src/Promise";

describe("Promise", () => {
  test("Promise resolve", (done) => {
    const promise = new Promise((resolve) => {
      resolve("success");
    });
    promise.then((value) => {
      expect(value).toBe("success");
      done();
    });
  });

  test("Promise reject", (done) => {
    const promise = new Promise((_, reject) => {
      reject("error");
    });
    promise.catch((reason) => {
      expect(reason).toBe("error");
      done();
    });
  });

  test("Promise status", () => {
    const promise = new Promise(() => {});
    expect(promise.status).toBe(STATUS.PENDING);
  });

  test("Promise.all", (done) => {
    const promise1 = Promise.resolve(1);
    const promise2 = Promise.resolve(2);
    Promise.all([promise1, promise2]).then((values) => {
      expect(values).toEqual([1, 2]);
      done();
    });
  });

  test("Promise.race", (done) => {
    const promise1 = new Promise((resolve) => {
      setTimeout(resolve, 100, "slow");
    });
    const promise2 = new Promise((resolve) => {
      setTimeout(resolve, 50, "fast");
    });
    Promise.race([promise1, promise2]).then((value) => {
      expect(value).toBe("fast");
      done();
    });
  });
});
