const fs = require("fs");
const DevServerUploadToS3Plugin = require("./webpack/plugin-dev-server-upload-to-s3");

module.exports = {
    devServer: {
        https: {
            key: fs.readFileSync("path/to/mkcert/files/localhost+3-key.pem"),
            cert: fs.readFileSync("path/to/mkcert/files/localhost+3.pem"),
            ca: fs.readFileSync("path/to/mkcert/files/rootCA.pem")
        }
    },
    plugins: [
        new DevServerUploadToS3Plugin({
            // uses s3. see https://www.npmjs.com/package/@auth0/s3

            // any other options are passed to new AWS.S3()
            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
            options: {
                // aws sdk will use default profile if no accessKeyId & secretAccessKey are provided
                accessKeyId: "your_AWS_AccessKeyId",
                secretAccessKey: "your_AWS_SecretAccessKey",
                region: "your_AWS_S3_bucket_region"
            },
            // other options supported by putObject, except Body and ContentLength.
            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
            params: {
                Bucket: "your_bucket_name",
                ACL: "public-read",
                // distant path ;file path & name will be concatenated to the Key parameter
                Key: "path/inside/bucket"
            }
        })
    ]
};
