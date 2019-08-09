const DevServerUploadToS3Plugin = require("./webpack-dev-server-s3");

const merge = require("webpack-merge");
const commonDev = require("./webpack.config.dev.js");

module.exports = merge(commonDev, {
    plugins: [new DevServerUploadToS3Plugin()]
});
