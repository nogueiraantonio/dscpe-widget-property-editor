const s3 = require("s3");
const path = require("path");
const mkdirp = require("mkdirp");
const fs = require("fs");

const pluginName = "DevServerUploadToS3Plugin";

class DevServerUploadToS3Plugin {
    constructor({ options = {}, params = {} }) {
        this.params = params;
        this.distPath = params.Key;
        delete this.params.Key;
        this.webpackDevServerHook = { fn: () => {} };
        this.client = s3.createClient(options);
    }

    /**
     * Plugin entry point
     */
    apply(compiler) {
        /**
         * webpack-dev-server hook is plugged on done
         * we remove this hook before done is processed
         */
        compiler.hooks.afterEmit.tap(pluginName, params => {
            this.removeWebpackDevServerHook(compiler);
        });
        compiler.hooks.done.tap(pluginName, stats => {
            const { targetPathArr, targetFileArr } = this.toDisk(stats, compiler);

            this.uploadToS3(targetPathArr, targetFileArr, () => {
                this.webpackDevServerHook.fn(stats);
                console.debug("sendind message for reloading...");
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
                    console.debug(params);
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
