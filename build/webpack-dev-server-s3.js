const s3 = require("s3");
const path = require("path");
const mkdirp = require("mkdirp");
const fs = require("fs");
const http = require("http");
const https = require("https");

const S3_DIST_PATH = "II2/WidgetLab/WidgetTemplate";
const pluginName = "DevServerUploadToS3Plugin";

const client = s3.createClient({
    s3Options: {
        // uses your default profile
        // else
        /* accessKeyId: "xxx",
        secretAccessKey: "xxx" */
    }
});

let webpackDevServerHook = { fn: () => {} };

class DevServerUploadToS3Plugin {
    constructor(options) {
        http.globalAgent.maxSockets = https.globalAgent.maxSockets = 20;
        console.debug(options);
    }

    /**
     * Plugin entry point
     */
    apply(compiler) {
        compiler.hooks.afterEmit.tap(pluginName, params => {
            this.removeWebpackDevServerHook(compiler);
        });
        compiler.hooks.done.tap(pluginName, stats => {
            this.writeToDiskAndUpload(stats, compiler);
        });
    }

    uploadToS3(sourcePathArr, targetFileArr, callback) {
        const promises = [];
        for (let i = 0; i < sourcePathArr.length; i++) {
            promises.push(
                new Promise((resolve, reject) => {
                    let s3FilePath = S3_DIST_PATH + "/" + targetFileArr[i];
                    console.error(s3FilePath);
                    const params = {
                        localFile: sourcePathArr[i],
                        s3Params: {
                            Bucket: "btcc",
                            Key: s3FilePath,
                            ACL: "public-read"
                            // other options supported by putObject, except Body and ContentLength.
                            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
                        }
                    };
                    const uploader = client.uploadFile(params);
                    uploader.on("error", err => {
                        console.error("unable to upload:", err.stack);
                        reject(err);
                    });
                    uploader.on("progress", () => {
                        // console.debug("progress", uploader.progressMd5Amount, uploader.progressAmount, uploader.progressTotal);
                    });
                    uploader.on("end", () => {
                        console.debug(`${targetFileArr[i]} uploaded`);
                        resolve();
                    });
                })
            );
        }
        Promise.all(promises).then(() => {
            callback();
        });
    }

    removeWebpackDevServerHook(compiler) {
        const hookIndex = compiler.hooks.done.taps.findIndex(hook => hook.name === "webpack-dev-server");
        if (hookIndex > -1) {
            webpackDevServerHook.fn = compiler.hooks.done.taps[hookIndex].fn;
            // remove webpack-dev-server hook (the one sending the message to the browser for reload)
            compiler.hooks.done.taps.splice(hookIndex, 1);
        }
    }

    writeToDiskAndUpload(stats, compiler) {
        const { compilation } = stats;
        const { assets } = compilation;
        const targetPathArr = [];
        const targetFileArr = [];
        let { outputPath } = compiler;
        if (outputPath === "/") {
            outputPath = compiler.context;
        }
        for (const assetPath of Object.keys(assets)) {
            let targetFile = assetPath;
            const asset = assets[assetPath];
            if (asset.emitted) {
                const queryStringIdx = targetFile.indexOf("?");
                if (queryStringIdx >= 0) {
                    targetFile = targetFile.substr(0, queryStringIdx);
                }
                const targetPath = path.isAbsolute(targetFile) ? targetFile : path.join(outputPath, targetFile);
                let content = asset.source();
                if (!Buffer.isBuffer(content)) {
                    // TODO need remove in next major release
                    if (Array.isArray(content)) {
                        content = content.join("\n");
                    }
                    content = Buffer.from(content, "utf8");
                }
                mkdirp.sync(path.dirname(targetPath));
                try {
                    fs.writeFileSync(targetPath, content, "utf-8");
                    targetPathArr.push(targetPath);
                    targetFileArr.push(targetFile);
                    console.debug(`Asset written to disk: ${path.relative(process.cwd(), targetPath)}`);
                } catch (e) {
                    console.debug(`Unable to write asset to disk:\n${e}`);
                }
            }
        }
        this.uploadToS3(targetPathArr, targetFileArr, () => {
            webpackDevServerHook.fn(stats);
            console.debug("sendind message for reloading...");
        });
    }
}

module.exports = DevServerUploadToS3Plugin;
