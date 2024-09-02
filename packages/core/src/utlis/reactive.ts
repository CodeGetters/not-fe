function reactive(obj) {
  if (obj == null || typeof obj !== "object") {
    return obj; // 不是数组和对象，直接返回，不代理了
  }

  const proxyObj = new Proxy(obj, {
    set(target, key, newVal, receiver) {
      const oldValue = target[key];
      if (newVal !== oldValue) {
        if (oldValue != undefined || oldValue != null) {
          console.log("修改、触发依赖,更新视图");
        } else {
          console.log("新增、触发依赖,更新视图");
        }
        return Reflect.set(target, key, newVal, receiver);
      }
      // 没改动，默认返回true
      return true;
    },
    get(target, key, receiver) {
      // 监听到获取
      const value = Reflect.get(target, key, receiver);
      if (key !== "length") {
        // 长度的时候不获取一下了，重复了
        console.log("获取数据，收集依赖");
      }
      // todo 如果防止value是对象，可以再包裹一层

      return reactive(value);
    },
  });
  return proxyObj;
}
const obj = reactive({ a: 1, b: 2 });

// es5继承
// function Parent() {
//   this.name = "parent";
// }

// function Son() {
//   Parent.call(this);
//   this.son = "son";
// }

// Son.prototype = Object.create(Parent.prototype);
// Son.prototype.constructor = Son;

// const son = new Son();
// // console.log(son, Son);

// // 圣杯继承
// function Son2() {
//   Origin.call(this);
//   this.son = "son2";
// }
// extend(Son2, Parent);

// function extend(Target, Origin) {
//   function Mid() {}
//   Mid.prototype = Origin.prototype;
//   Target.prototype = new Mid();
//   Target.prototype.constructor = Target;
// }
// const son2 = new Son2();
