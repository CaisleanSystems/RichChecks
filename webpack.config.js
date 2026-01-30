const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
    entry: "./index.js", // your main entry point file
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"), // output directory as dist
    },
    mode: "production", // use 'development' for unminified builds
    target: "node", // target node runtime
    externals: {
        // Don't bundle these two
        "@actions/core": "commonjs2 @actions/core",
        "@actions/github": "commonjs2 @actions/github",
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "LICENSE.txt"),
                    to: path.resolve(__dirname, "dist"),
                },
            ],
        }),
    ],
};
