// import { Promise } from "@repo/core/Promise";
const { Promise } = require("@repo/core");
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
