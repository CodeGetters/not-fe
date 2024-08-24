// import { Promise } from "@repo/core";
const Promise = require("@repo/core").Promise;
let promise = new Promise((resolve, reject) => {
  console.log("promise resolve");
  // resolve("ok");
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
