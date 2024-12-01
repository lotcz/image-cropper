const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './index.ts',
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{from: './index.html', to: ''},
				{from: './build/image-cropper.css', to: ''}
			]
		})
	],
	output: {
		filename: 'image-cropper.js',
		path: path.resolve(__dirname, 'dist'),
		clean: true
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
};
