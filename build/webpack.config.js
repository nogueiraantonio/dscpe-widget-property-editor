const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CopyPlugin = require("copy-webpack-plugin");
// const webpack = require("webpack");

module.exports = env => {
    return {
        mode: "development",
        entry: ["./src/main.js"],
        // devServer: {
        //     contentBase: path.resolve(__dirname, 'standalone'),
        //     port: 9001,
        //     watchContentBase: true
        // },
        output: {
            filename: "bundle.js",
            path: path.resolve(__dirname, "dist")
        },
        module: {
            rules: [
                {
                    test: /.vue$/,
                    loader: "vue-loader"
                },
                {
                    test: /.js$/,
                    loader: "babel-loader",
                    exclude: /node_modules/,
                    query: {
                        presets: ["@babel/env"]
                    }
                }
                // {
                //     test: /\.css$/,
                //     loaders: ['style-loader', 'css-loader?minimize', 'postcss-loader']
                // }
            ]
        },
        plugins: [new CopyPlugin([{ from: "./src/index.html", to: "./index.html" }, { from: "./static/*", to: "./dist/static/" }]), new VueLoaderPlugin()]
    };
};
