// const fs = require("fs");

module.exports = {
    dev: {
        // in this section you can override option defined in webpack.config.dev.js
        devServer: {
    //         https: {
    //             key: fs.readFileSync("path/to/mkcert/files/localhost+3-key.pem"),
    //             cert: fs.readFileSync("path/to/mkcert/files/localhost+3.pem")
    //         }
         }
    },
    s3: {
        options: {
            // aws sdk will use default profile if no accessKeyId & secretAccessKey are provided
            accessKeyId: "your_AWS_AccessKeyId",
            secretAccessKey: "your_AWS_SecretAccessKey",
            region: "your_AWS_S3_bucket_region"
        },
        params: {
            Bucket: "your_bucket_name",
            ACL: "public-read",
            // distant path ;file path & name will be concatenated to the Key parameter
            Key: "path/inside/bucket"
        }
    }
};
