const fs = require("fs");

module.exports = {
    // dev: {
    //     mode: "development",
    //     devtool: "inline-source-map",
    //     devServer: {
    //         contentBase: "./dist",
    //         hot: true,
    //         port: 8081,
    //         compress: true,
    //         // allow to be called from any host
    //         disableHostCheck: true,
    //         // host must be 0.0.0.0 if we want to be reachable from LAN
    //         // host,
    //         // if publicPath, open the browser on the right url
    //         // public: publicUrl,
    //         // to prevent CORS issues
    //         headers: { "Access-Control-Allow-Origin": "*" },
    //         writeToDisk: false,
    //         https: {
    //             key: fs.readFileSync("path/to/mkcert/files/localhost+3-key.pem"),
    //             cert: fs.readFileSync("path/to/mkcert/files/localhost+3.pem")
    //         }
    //     },
    //     // output: {
    //     //     publicPath
    //     // },
    //     module: {
    //         rules: []
    //     }
    // },
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
