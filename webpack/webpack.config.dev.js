const { merge } = require("webpack-merge");
const common = require("./webpack.config.common.js");
const { webpackDevOptions, urls } = require("../widget-config.js");
const webpack = require("webpack");
const USE_EXTERNAL_DEBUGGER = require("../widget-config").devVariables.vue.useExternalDebugger;

// use default public value ?
if (!urls.public) urls.public = urls.local;

const locUrl = new URL(urls.local);
const pubUrl = new URL(urls.public);
let port = locUrl.port;
if (!port) port = locUrl.protocol === "https:" ? 443 : 80;

module.exports = merge(
    common,
    {
        mode: "development",
        devtool: "inline-source-map",
        devServer: {
            contentBase: "./dist",
            hot: true,
            compress: true,
            // allow to be called from any host
            disableHostCheck: true,
            // to prevent CORS issues
            headers: { "Access-Control-Allow-Origin": "*" },
            writeToDisk: false,

            // these options are computed from localUrl and publicUrl global parameters
            port,
            host: locUrl.hostname,
            public: pubUrl.href,
            sockPath: locUrl.pathname + "sockjs-node"
        },
        output: {
            // these options are computed from localUrl and publicUrl global parameters
            publicPath: locUrl.pathname
        },
        module: {
            rules: []
        },
        plugins: [
            new webpack.DefinePlugin({
                "process.env.devVariables": {
                    USE_EXTERNAL_DEBUGGER
                }
            })
        ]
    },
    webpackDevOptions
);
