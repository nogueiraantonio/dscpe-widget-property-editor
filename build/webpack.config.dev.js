const merge = require("webpack-merge");
const common = require("./webpack.config.common.js");
const fs = require("fs");

// set using
// npm config set widget-template-vue:publicPath "https://3dexp.19xfd03.ds/WidgetLab/"
let publicPath = process.env.npm_package_config_publicPath;
let publicUrl = publicPath;
let host = "0.0.0.0";
if (publicPath === undefined || publicPath === null || publicPath === "null" || publicPath.trim() === "") {
    publicPath = "";
    host = "localhost";
    publicUrl = undefined;
}

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        contentBase: "./dist",
        hot: true,
        port: 8081,
        compress: true,
        // allow to be called from any host
        disableHostCheck: true,
        // host must be 0.0.0.0 if we want to be reachable from LAN
        host,
        // if publicPath, open the browser on the right url
        public: publicUrl,
        // to prevent CORS issues
        headers: { "Access-Control-Allow-Origin": "*" },
        writeToDisk: false,
        // TODO : find a way to parametrize this
        https: {
            key: "" /*fs.readFileSync("PATH_TO_KEY/localhost+3-key.pem")*/,
            cert: "" /* fs.readFileSync("PATH_TO_CERT/localhost+3.pem") */,
            ca: "" /* fs.readFileSync("PATH_TO_CA/rootCA.pem")*/
        }
    },
    output: {
        publicPath
    },
    module: {
        rules: []
    }
});
