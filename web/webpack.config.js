const path = require('path');
const webpack = require('webpack');
require('dotenv').config();

const ErrorOverlayPlugin = require('@webhotelier/webpack-fast-refresh/error-overlay');
const ReactRefreshPlugin = require('@webhotelier/webpack-fast-refresh');

const isProduction = () => {
	return process.env.TEST || process.env.NODE_ENV === 'production';
};

const entries = () => {
	return [
		require.resolve('./src/enable-website.ts'),
		isProduction() ? null : 'webpack-hot-middleware/client',
		isProduction() ? null : '@webhotelier/webpack-fast-refresh/runtime.js',
		require.resolve('./src/app.tsx'),
		require.resolve('./src/styles.ts'),
	].filter(Boolean);
};

const exclude = /node_modules[/\\](?!react-native-gifted-chat|react-native-lightbox|react-native-parsed-text|react-native-typing-animation)/;

module.exports = {
	entry: entries(),
	output: {
		path: path.join(__dirname, '..', 'dist', 'web', 'src', 'static'),
		filename: 'app.js',
		publicPath: '/static/',
	},
	node: {
		global: true,
	},
	devtool: isProduction() ? false : 'cheap-module-source-map',
	mode: isProduction() ? 'production' : 'development',
	resolve: {
		alias: {
			'react-native$': 'react-native-web',
			path: 'path-browserify',
		},
		extensions: [
			'*',
			'.web.js',
			'.web.ts',
			'.web.tsx',
			'.js',
			'.json',
			'.css',
			'.ts',
			'.tsx',
			'.png',
		],
	},
	devServer: {
		contentBase: path.resolve(__dirname, '..', 'web'),
		historyApiFallback: {
			index: 'index.html',
		},
		hot: true,
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.(png|jpe?g|gif)$/,
				loader: 'react-native-web-image-loader',
				options: {
					name: '[hash].[ext]',
				},
			},

			{
				test: /\.ts$|\.tsx$|\.js$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								require.resolve('@babel/preset-env'),
								require.resolve('@babel/preset-react'),
								[
									require.resolve('@babel/preset-typescript'),
									{
										runtime: 'automatic',
										isTSX: true,
										allExtensions: true,
									},
								],
							],
							plugins: [
								'@babel/plugin-proposal-class-properties',
								isProduction()
									? null
									: require.resolve('react-refresh/babel'),
								'transform-react-remove-prop-types',
							].filter(Boolean),
						},
					},
					isProduction()
						? null
						: {
								loader: require.resolve(
									'@webhotelier/webpack-fast-refresh/loader.js'
								),
						  },
				].filter(Boolean),
				exclude,
			},
			{
				test: /\.(ttf|eot|svg|woff(2)?)(\S+)?$/,
				use: 'file-loader?name=[name].[ext]',
			},
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			process: {
				cwd: () => '',
				env: {
					NODE_ENV: JSON.stringify(
						isProduction() ? 'production' : 'development'
					),
					REACT_APP_ONESIGNAL_APP_ID: JSON.stringify(
						process.env.REACT_APP_ONESIGNAL_APP_ID ||
							'ef01fdd5-ab27-4725-ab26-d1f924aa5ef1'
					),
					REACT_APP_ONESIGNAL_SAFARI_WEB_ID: JSON.stringify(
						process.env.REACT_APP_ONESIGNAL_SAFARI_WEB_ID ||
							'web.onesignal.auto.40adfb09-7751-41be-9e4d-5711eb8f35a8'
					),
					REACT_APP_OIDC_CLIENT_ID: JSON.stringify(
						process.env.REACT_APP_OIDC_CLIENT_ID || 'bestande_production'
					),
					REACT_APP_OIDC_REDIRECT_URI: JSON.stringify(
						process.env.REACT_APP_OIDC_REDIRECT_URI ||
							'https://staging.bestande.ch/login'
					),
				},
				versions: {
					node: null,
				},
			},
		}),
		new ReactRefreshPlugin(),
		new ErrorOverlayPlugin(),
		new webpack.HotModuleReplacementPlugin(),
	],
};
