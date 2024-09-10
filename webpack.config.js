const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './index.ts',
	devtool: 'source-map',
	devServer: {
		contentBase: './build',
		port: 8000
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{from: './index.html', to: ''}
			]
		})
	],
	output: {
		filename: 'image-cropper.js',
		path: path.resolve(__dirname, 'build'),
		clean: true,
		library: {
			name: "cropper",
			type: "umd"
		}
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
