const merge = require("webpack-merge");
const commonDev = require("./webpack.config.dev.js");
const DevServerUploadToS3Plugin = require("./plugin-dev-server-upload-to-s3");
const s3cfg = require("../widget-config.js").s3;

module.exports = merge(commonDev, {
    plugins: [
        new DevServerUploadToS3Plugin({
            // uses s3. see https://www.npmjs.com/package/@auth0/s3

            // any other options are passed to new AWS.S3()
            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
            options: s3cfg.options,
            // other options supported by putObject, except Body and ContentLength.
            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
            params: s3cfg.params
        })
    ]
});
