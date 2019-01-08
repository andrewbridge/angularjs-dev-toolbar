const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'production',
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.min.js'
		}
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		})
	]
});