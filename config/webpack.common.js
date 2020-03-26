/**
 *
 * @file webpack.common.js
 * @author Jérémy Levron <jeremylevron@19h47.fr> (http://19h47.fr)
 */

// Node modules
const path = require('path');

// Plugins
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

function resolve (dir) {
	return path.join(__dirname, '..', dir)
}

module.exports = {
	devServer: {
		contentBase: resolve("dist"),
		compress: true,
		port: 3000,
		inline: true
	},
	externals: {
		jquery: "jQuery",
		jQuery: "jQuery",
		$: "jQuery"
	},
	optimization: {
		splitChunks: {
			name: "common"
		}
	},
	resolve: {
		alias: {
			"@": resolve("src"),
			vue$: "vue/dist/vue.esm.js",

			// js
			scripts: resolve("src/scripts"),
			Blocks: resolve("src/scripts/blocks"),
			Common: resolve("src/scripts/common"),
			Pages: resolve("src/scripts/pages"),
			Transitions: resolve("src/scripts/transitions"),
			Components: resolve("src/scripts/components"),
			Utils: resolve("src/scripts/utils"),
			Services: resolve("src/scripts/services"),
			Factories: resolve("src/scripts/factories"),
			Router: resolve("src/scripts/router"),
			Api: resolve("src/scripts/api"),
			Store: resolve("src/scripts/store"),
			Vendors: resolve("src/scripts/vendors"),

			// img
			img: resolve("src/img"),
			png: resolve("src/img/png"),
			jpg: resolve("src/img/jpg"),
			svg: resolve("src/img/svg"),

			// videos
			videos: resolve("src/videos"),

			// icons
			icons: resolve("src/icons"),

			// fonts
			fonts: resolve("src/fonts"),

			// stylesheets
			stylesheets: resolve("src/stylesheets")
		}
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader"
			},
			{
				enforce: "pre",
				test: /\.(js|vue)$/,
				exclude: [/node_modules/, /vendors/],
				loader: "eslint-loader"
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			},
			{
				test: /\.(woff2?|eot|ttf|otf|woff|svg)?$/,
				exclude: [/img/, /icons/],
				use: [
					{
						loader: "file-loader",
						options: {
							name: "[name].[ext]",
							outputPath: "fonts/",
							publicPath: "../fonts/"
						}
					}
				]
			},
			{
				test: /\.svg$/,
				exclude: [/img/, /fonts/],
				use: [
					{
						loader: "svg-sprite-loader",
						options: {
							spriteFilename: "icons.svg",
							extract: true
						}
					},
					"svg-transform-loader",
					"svgo-loader"
				]
			},
			{
				test: /\.svg$/,
				exclude: [/fonts/, /icons/],
				use: [
					{
						loader: "file-loader",
						options: {
							outputPath: "img/svg"
						}
					},
					{
						loader: "svgo-loader",
						options: {
							plugins: [
								{
									removeTitle: true
								},
								{
									convertColors: {
										shorthex: false
									}
								},
								{
									convertPathData: false
								}
							]
						}
					}
				]
			},
			{
				test: /\.(gif|png|jpe?g)$/i,
				use: [
					{
						loader: "file-loader",
						options: {
							outputPath: "img/",
							name: "[ext]/[name].[ext]"
							// publicPath: '../img/',
						}
					},
					{
						loader: "image-webpack-loader",
						options: {
							mozjpeg: {
								progressive: true,
								quality: [65]
							},
							optipng: {
								enabled: false
							},
							pngquant: {
								quality: [0.65, 0.9],
								speed: 4
							},
							gifsicle: {
								interlaced: false
							}
						}
					}
				]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: resolve("index.html")
		}),
		new ManifestPlugin(),
		new SpriteLoaderPlugin(),
		new VueLoaderPlugin(),
		new WebpackNotifierPlugin({
			title: "Webpack",
			excludeWarnings: true,
			alwaysNotify: true
		})
	]
};
