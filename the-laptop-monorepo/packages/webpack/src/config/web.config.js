const { log } = console;

exports.web = () => (none, { analyzer=false, mode="development" }) => {
    try {
        // Utils
        const { withPath } = require("../utils/withPath");
        const { withSwitch } = require("../utils/withSwitch");
        const { resolve } = require("path");
        const webpack = require("webpack");

        // Plugins
        const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
        const { CleanWebpackPlugin } = require("clean-webpack-plugin");
        const HtmlWebpackPlugin = require("html-webpack-plugin");
        const HtmlWebpackTemplate = require("html-webpack-template");
        const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
        const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
        const ManifestPlugin = require("webpack-manifest-plugin");
        const DotEnvPlugin = require("dotenv-webpack");
        const WebpackBar = require("webpackbar");

        // Path resolvers.
        const project = withPath();
        const src = withPath(resolve("src"));

        /**
         * [ABOUT]
         * Import and validate environment configuration.
         * If an error is found for the environment configuration
         * it will throw, failing the Webpack build and displaying
         * a message about the environment variables that failed to
         * properly load and validate for the environment.
         */
        // require("dotenv-safe").config({
        //     allowEmptyValues: false,
        //     path
        // });

        return {
            mode,
            target: "web",
            devtool: withSwitch(mode, {
                development: "inline-source-map",
                production: false
            }),
            devServer: {
                historyApiFallback: true,
                contentBase: project`.dist/app`,
                compress: true,
                port: 9000,
                hot: true,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                    "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
                },
            },
            entry: {
                app: [ src`index.jsx` ],
            },
            output: withSwitch(mode, {
                default: {
                    path: project`.dist/app`,
                    publicPath: "/"
                },
                production: {
                    chunkFilename: "[name].[chunkhash].bundle.js",
                    filename: "[name].[chunkhash].bundle.js",
                },
                development: {
                    chunkFilename: "[name].bundle.js",
                    filename: "[name].bundle.js",
                }
            }),
            optimization: {
                splitChunks: {
                    chunks: "all",
                    cacheGroups: {
                        commons: {
                            test: /[\\/]node_modules[\\/]/,
                            name: "vendor",
                            chunks: "initial"
                        }
                    }
                },
                runtimeChunk: {
                    name: "manifest"
                },
                minimizer: [
                    new UglifyJsPlugin({
                        sourceMap: true,
                        uglifyOptions: {
                            ecma: 8,
                            mangle: false,
                            keep_classnames: true,
                            keep_fnames: true
                        }
                    })
                ]
            },
            resolve: {
                modules: [
                    "node_modules",
                ],
                extensions: [
                    "*", ".js", ".jsx",
                    ".png", ".jpg", ".jpeg", ".ico",
                    ".less", ".sass", ".scss"
                ]
            },
            plugins: (plugins => {
                if (analyzer)
                    plugins.push(new BundleAnalyzerPlugin({
                        analyzerMode: "static"
                    }));

                return plugins;
            })([
                new WebpackBar(),
                new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
                new FaviconsWebpackPlugin({
                    logo: src`assets/img/favicon.png`,
                    outputPath: src`.dist`,
                    inject: true,
                }),
                new HtmlWebpackPlugin({
                    hash: true,
                    title: "Rauster",
                    template: HtmlWebpackTemplate,
                    appMountId: "app",
                    links: [{
                        rel: "stylesheet",
                        href: "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                    }],
                    meta: {
                        viewport:
                            "width=device-width, " +
                            "initial-scale=1, " +
                            "shrink-to-fit=no, " +
                            "user-scalable=no"
                    }
                }),
                // new DotEnvPlugin({
                //     path,
                //     safe: true,
                //     systemvars: false,
                //     silent: false,
                //     allowEmptyValues: false
                // }),
                new ManifestPlugin()
            ]),
            module: { rules: [{
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ],
                        plugins: [
                            "@babel/plugin-proposal-class-properties",
                            "@babel/plugin-proposal-object-rest-spread",
                            "@babel/plugin-transform-runtime",
                            "@babel/plugin-syntax-dynamic-import",
                            "@babel/plugin-proposal-optional-chaining",
                            "@babel/plugin-proposal-nullish-coalescing-operator",
                            "react-loadable/babel"
                        ]
                    }
                }
            }, {
                test: /\.s[ac]ss$/i,
                exclude: /node_modules/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "sass-loader",
                    options: {
                        sassOptions: {
                            outputStyle: "compressed"
                        }
                    }
                }]
            }, {
                test: /\.less$/i,
                exclude: /node_modules/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "less-loader",
                    options: {
                        lessOptions: {
                            javascriptEnabled: true
                        }
                    }
                }]
            }, {
                test: /\.css$/i,
                exclude: /node_modules\/(?!(react-image-crop)\/).*/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }]
            }, {
                test: /\.(jpg|jpeg|ico|png|oft|woff|woff2|eot|ttf|svg)$/,
                exclude: /\.(s[ac]ss|less)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        outputPath: "assets",
                        publicPath: "/assets"
                    }
                }]
            }]}
        };
    } catch(e) {
        throw e;
    }
}