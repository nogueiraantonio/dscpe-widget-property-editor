const DevServerUploadToS3Plugin = require("./webpack-dev-server-s3");

const merge = require("webpack-merge");
const commonDev = require("./webpack.config.dev.js");

module.exports = merge(commonDev, {
    devServer: {},
    plugins: [
        new DevServerUploadToS3Plugin({
            // uses s3. see https://www.npmjs.com/package/s3

            // any other options are passed to new AWS.S3()
            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
            options: {
                // aws sdk will use default profile if no accessKeyId & secretAccessKey are provided
                /* accessKeyId: "xxx",
                secretAccessKey: "xxx" */
                region: "eu-west-1"
            },
            // other options supported by putObject, except Body and ContentLength.
            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
            params: {
                Bucket: "btcc",
                ACL: "public-read",
                // distant path ;file path & name will be concatenated to the Key parameter
                Key: "II2/WidgetLab/WidgetTemplate"
            }
        })
    ]
});
