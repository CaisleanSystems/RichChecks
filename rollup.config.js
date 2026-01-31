import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
    input: "index.js",
    external: () => false, 
    output: {
        file: "dist/index.cjs",
        format: "cjs",
        sourcemap: true
    },
    plugins: [
        nodeResolve({
            preferBuiltins: true
        }),
        commonjs({
            include: /node_modules/
        })
    ]
};
