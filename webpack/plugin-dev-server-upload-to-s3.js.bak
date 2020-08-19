const s3 = require("@auth0/s3");
const path = require("path");
const mkdirp = require("mkdirp");
const fs = require("fs");

const PLUGIN_NAME = "DevServerUploadToS3Plugin";
const NUMBER_OF_HOT_RELOAD_FILES_TO_KEEP = 3;

class DevServerUploadToS3Plugin {
    constructor({ options = {}, params = {} }) {
        this.publicUrl = `https://${params.Bucket}.s3-${options.region}.amazonaws.com/${params.Key}/index.html`;
        this.params = params;
        this.distPath = params.Key;
        delete this.params.Key;
        this.webpackDevServerHook = { fn: () => {} };
        this.client = s3.createClient({ s3Options: options });
        this.lastUploadedHotReloadFiles = [];
    }

    /**
     * Plugin entry point
     */
    apply(compiler) {
        /**
         * webpack-dev-server hook is plugged on done
         * we remove this hook before done is processed
         */
        compiler.hooks.afterEmit.tap(PLUGIN_NAME, params => {
            this.removeWebpackDevServerHook(compiler);
        });
        compiler.hooks.done.tap(PLUGIN_NAME, stats => {
            const { targetPathArr, targetFileArr } = this.toDisk(stats, compiler);

            const hotReloadFiles = targetFileArr.filter(fileName => /.*\.hot-update\.(js|json)$/.test(fileName));
            if (hotReloadFiles.length > 0) {
                this.lastUploadedHotReloadFiles.push([...hotReloadFiles]);
            }

            this.uploadToS3(targetPathArr, targetFileArr, () => {
                this.webpackDevServerHook.fn(stats);
                console.debug("sending message for reloading...");
                console.debug("--> " + this.publicUrl);
            });

            this.deletePreviousHotReloadFiles();
        });
    }

    deletePreviousHotReloadFiles() {
        while (this.lastUploadedHotReloadFiles.length > NUMBER_OF_HOT_RELOAD_FILES_TO_KEEP) {
            this.lastUploadedHotReloadFiles.shift(); // Remove the oldest group of files from the array
        }

        return new Promise((resolve, reject) => {
            const listObjectsRequest = this.client.listObjects({
                s3Params: {
                    Bucket: this.params.Bucket,
                    Prefix: this.distPath
                },
                recursive: false
            });

            let filesToDelete = [];
            let lastUploaded = this.lastUploadedHotReloadFiles.flat();
            listObjectsRequest.on("data", data => {
                // Populate filesToDelete with the hot reload files returned by S3 (excepted our last uploaded files).
                filesToDelete = filesToDelete.concat(
                    data.Contents.map(file => file.Key)
                        .filter(fileName => /.*\.hot-update\.(js|json)$/.test(fileName))
                        .filter(fileName => lastUploaded.every(lastUploadedFile => fileName.indexOf(lastUploadedFile) === -1))
                );
            });

            listObjectsRequest.on("end", () => {
                resolve(filesToDelete);
            });
        }).then(filesToDelete => {
            if (filesToDelete.length === 0) {
                return;
            }
            return new Promise((resolve, reject) => {
                const deleteObjectsRequest = this.client.deleteObjects({
                    Bucket: this.params.Bucket,
                    Delete: {
                        Objects: filesToDelete.map(fileName => {
                            return { Key: fileName };
                        }),
                        Quiet: false
                    }
                });

                deleteObjectsRequest.on("end", () => {
                    resolve();
                });
            });
        });
    }

    uploadToS3(sourcePathArr, targetFileArr, callback) {
        const promises = [];
        for (let i = 0; i < sourcePathArr.length; i++) {
            promises.push(
                new Promise((resolve, reject) => {
                    const Key = `${this.distPath}/${targetFileArr[i]}`;
                    const params = {
                        localFile: sourcePathArr[i],
                        s3Params: {
                            Key,
                            ...this.params
                        }
                    };
                    const uploader = this.client.uploadFile(params);
                    uploader.on("error", err => {
                        console.error("unable to upload:", err.stack);
                        reject(err);
                    });
                    uploader.on("progress", () => {
                        // console.debug("progress", uploader.progressMd5Amount, uploader.progressAmount, uploader.progressTotal);
                    });
                    uploader.on("end", () => {
                        console.debug(`${Key} uploaded`);
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
            this.webpackDevServerHook.fn = compiler.hooks.done.taps[hookIndex].fn;
            // remove webpack-dev-server hook (the one sending the message to the browser for reload)
            compiler.hooks.done.taps.splice(hookIndex, 1);
        }
    }
    /**
     * Very inspired from webpack-dev-middleware/lib/fs.js
     */
    toDisk(stats, compiler) {
        const { compilation } = stats;
        const { assets } = compilation;
        let { outputPath } = compiler;
        const targetPathArr = [];
        const targetFileArr = [];
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

        return { targetPathArr, targetFileArr };
    }
}

module.exports = DevServerUploadToS3Plugin;
