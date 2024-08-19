import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.ts",
  output: [
    {
      dir: "./dist/cjs",
      format: "cjs",
      sourcemap: true,
    },
    {
      dir: "./dist/umd",
      format: "umd",
      name: "MyModule",
      sourcemap: true,
    },
    {
      dir: "./dist/esm",
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [nodeResolve(), typescript({ tsconfig: "./tsconfig.json" })],
};
