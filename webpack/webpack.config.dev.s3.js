const merge = require("webpack-merge");
const commonDev = require("./webpack.config.dev.js");
const DevServerUploadToS3Plugin = require("./webpack-dev-server-s3");
const localConfigS3Options = require("../localConfig.js").s3.options;
const localConfigS3Params = require("../localConfig.js").s3.params;

module.exports = merge(commonDev, {
    plugins: [
        new DevServerUploadToS3Plugin({
            // uses s3. see https://www.npmjs.com/package/@auth0/s3

            // any other options are passed to new AWS.S3()
            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
            options: {
                localConfigS3Options
            },
            // other options supported by putObject, except Body and ContentLength.
            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
            params: {
                localConfigS3Params
            }
        })
    ]
});
