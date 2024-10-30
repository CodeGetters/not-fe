// setTimeout(() => {
//   console.log(1);
// }, 0);

// new Promise((resolve, reject) => {
//   console.log(2);
//   resolve();
//   console.log(6);
// })
//   .then(() => {
//     console.log(3);
//   })
//   .then(() => {
//     console.log(4);
//   });

console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("C");
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("D");
        resolve();
      }, 0);
    });
  })
  .then(() => {
    console.log("E");
  });

new Promise((resolve) => {
  console.log("F");
  resolve();
}).then(() => {
  console.log("G");
});

console.log("H");
// A F H C G B D E

// new Promise((resolve) => {
//   setTimeout(() => {
//     console.log(666);
//     new Promise((resolve) => {
//       resolve();
//     }).then(() => {
//       console.log(777);
//     });
//   });
//   resolve();
// })
//   .then(() => {
//     new Promise((resolve) => {
//       resolve();
//     })
//       .then(() => {
//         console.log(111);
//       })
//       .then(() => {
//         console.log(222);
//       });
//   })
//   .then(() => {
//     new Promise((resolve) => {
//       resolve();
//     })
//       .then(() => {
//         new Promise((resolve) => {
//           resolve();
//         }).then(() => {
//           console.log(444);
//         });
//       })
//       .then(() => {
//         console.log(555);
//       });
//   })
//   .then(() => {
//     console.log(333);
//   });
// 答案是1234567
