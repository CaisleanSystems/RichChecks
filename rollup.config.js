import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
    input: "index.js",
    output: {
        esModule: true,
        file: "dist/index.js",
        format: "es",
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
