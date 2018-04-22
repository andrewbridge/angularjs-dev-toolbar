const path = require('path');
const webpack = require('webpack');

module.exports = env => {
	console.log('Production: ', !!(env && env.production));
	return {
		entry: ['./src/index.js', './src/styles.scss'],
		output: {
			filename: 'bundle.js',
			path: path.resolve(__dirname, 'dist')
		},
		mode: env && env.production ? 'production' : 'development',
		resolve: {
			alias: {
				'vue$': env && env.production ? 'vue/dist/vue.min.js' : 'vue/dist/vue.esm.browser.js'
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
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: env && env.production ? '"production"' : '"development"'
				}
			})
		]
	};
};