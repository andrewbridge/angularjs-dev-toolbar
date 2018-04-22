const path = require('path');
const webpack = require('webpack');

module.exports = env => {
	console.log('Production: ', env.production);
	return {
		entry: ['./src/index.js', './src/styles.scss'],
		output: {
			filename: 'bundle.js',
			path: path.resolve(__dirname, 'dist')
		},
		mode: env.production ? 'production' : 'development',
		resolve: {
			alias: {
				'vue$': 'vue/dist/vue.esm.browser.js'
			}
		},
		module: {
			rules: [{
				test: /\.scss$/,
				use: [{
					loader: "style-loader" // creates style nodes from JS strings
				}, {
					loader: "css-loader" // translates CSS into CommonJS
				}, {
					loader: "sass-loader" // compiles Sass to CSS
				}]
			}]
		}
	};
};