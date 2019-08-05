const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const VuetifyLoaderPlugin = require("vuetify-loader/lib/plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// set using
// npm config set widget-template-vue:publicPath "https://3dexp.19xfd03.ds/WidgetLab/"
let publicPath = process.env.npm_package_config_publicPath;
let host = "0.0.0.0";
if (publicPath === undefined || publicPath === null || publicPath.trim() === "") {
    publicPath = "";
    host = "localhost";
}

module.exports = env => {
    return {
        mode: "development",
        entry: ["./src/main.js"],
        devtool: "inline-source-map",
        devServer: {
            contentBase: "./dist",
            hot: true,
            compress: true,
            // allow to be called from any host
            disableHostCheck: true,
            // host must be 0.0.0.0 if we want to be reachable from LAN
            host,
            // to prevent CORS issues
            headers: { "Access-Control-Allow-Origin": "*" }
        },
        output: {
            filename: "bundle.js",
            path: path.resolve(__dirname, "../dist"),
            publicPath
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
