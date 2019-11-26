const merge = require("webpack-merge");
const common = require("./webpack.config.common.js");
const { dev, urls } = require("../widget-config.js");

// use default public value ?
if (!urls.public) urls.public = urls.local;

let locUrl = new URL(urls.local);
let pubUrl = new URL(urls.public);
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
            port: port,
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
        }
    },
    dev
);
