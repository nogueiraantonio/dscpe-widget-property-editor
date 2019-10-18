const merge = require("webpack-merge");
const commonDev = require("./webpack.config.dev.js");
const localConfigPlugins = require("../localConfig.js").plugins;

module.exports = merge(commonDev, { plugins: localConfigPlugins });
