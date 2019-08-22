const merge = require("webpack-merge");
const common = require("./webpack.config.common.js");

module.exports = merge(common, {
    mode: "production",
    performance: {
        maxAssetSize: 1000000
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.(js|vue)$/,
                exclude: [/node_modules/, /src\/static/],
                loader: "eslint-loader"
            }
        ]
    }
});
