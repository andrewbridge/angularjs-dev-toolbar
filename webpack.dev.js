const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'development',
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.esm.browser.js'
		}
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"development"'
			}
		})
	],
	devServer: {
		contentBase: path.join(__dirname, '/dist'),
		compress: true,
		port: 9000
	}
});