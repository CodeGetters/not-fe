/**
 * @article:https://segmentfault.com/a/1190000020255831
 * @param target
 * @param map
 * @returns
 */
function clone(target, map = new WeakMap()) {
  if (typeof target === "object") {
    const cloned = Array.isArray(target) ? [] : {};
    if (map.has(target)) {
      return map.get(target);
    }
    map.set(target, cloned);
    for (const key in target) {
      cloned[key] = clone(target[key], map);
    }
    return cloned;
  } else {
    return target;
  }
}
