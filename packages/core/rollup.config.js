import typescript from "@rollup/plugin-typescript";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import clear from "rollup-plugin-clear";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.ts",
  /*构建三套，一个 umd 通用的，一个 ES 模块的，一个 cjs 模块的，webpack 等可以直接用 ES 的，便于代码提示*/
  output: [
    {
      // dir: "./dist/umd/",
      file: "dist/index.js",
      format: "umd",
      name: "index",
      sourcemap: true,
    },
    {
      // dir: "dist/esm",
      file: "dist/index.esm.js",
      format: "es",
      sourcemap: true,
      exports: "named",
    },
    {
      // dir: "dist/cjs",
      file: "dist/index.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins: [
    /*打包之前清除 dist 目录*/
    clear({ targets: ["dist"] }),
    resolve(),
    commonjs(),
    /*压缩代码*/
    terser(),
    /*babel 处理*/
    babel({
      exclude: "node_modules/**",
      runtimeHelpers: true,
    }),
    typescript({ tsconfig: "./tsconfig.json" }),
  ],
};
