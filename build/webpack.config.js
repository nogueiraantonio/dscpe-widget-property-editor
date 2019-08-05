const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const VuetifyLoaderPlugin = require("vuetify-loader/lib/plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
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
        devtool: "inline-source-map",
        devServer: {
            contentBase: "./dist"
        },
        output: {
            filename: "bundle.js",
            path: path.resolve(__dirname, "../dist")
        },
        module: {
            rules: [
                {
                    test: /\.(svg|eot|woff|ttf|svg|woff2)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "[name].[ext]",
                                outputPath: "static/fonts"
                            }
                        }
                    ]
                },
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
                },
                {
                    test: /.css$/,
                    loader: ["style-loader", "css-loader"]
                },
                {
                    test: /\.s(c|a)ss$/,
                    use: [
                        "vue-style-loader",
                        "css-loader",
                        {
                            loader: "sass-loader",
                            options: {
                                implementation: require("sass"),
                                fiber: require("fibers"),
                                indentedSyntax: true // optional
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CopyPlugin([{ from: "./src/index.html", to: "./index.html" }, { from: "./static/*", to: "./dist/static/" }]),
            new VueLoaderPlugin(),
            new VuetifyLoaderPlugin()
        ]
    };
};
