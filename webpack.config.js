const path = require('path');
const webpack = require('webpack');

const ErrorOverlayPlugin = require('@webhotelier/webpack-fast-refresh/error-overlay');
const ReactRefreshPlugin = require('@webhotelier/webpack-fast-refresh');

const isProduction = () => {
	return process.env.TEST || process.env.NODE_ENV === 'production';
};

const entries = () => {
	return [
		'setimmediate',
		'./core/data/enable-web-app.ts',
		isProduction() ? null : 'webpack-hot-middleware/client',
		isProduction() ? null : '@webhotelier/webpack-fast-refresh/runtime.js',
		require.resolve('./index.js'),
	].filter(Boolean);
};

const exclude = /node_modules[/\\](?!react-native-gifted-chat|react-native-lightbox|react-native-parsed-text|react-native-typing-animation|react-native-gesture-handler|react-native-markdown-view|react-native-tabular-grid-markdown-view|react-native-linear-gradient|react-native-image-zoom-viewer|react-native-gallery-swiper|react-native-flip-card|@react-native-segmented-control\/segmented-control|react-native-page-list|react-native-image-transformer|react-native-image-pan-zoom|react-native-document-picker|react-native-check-box|react-native-reanimated|react-native-animatable|@react-native-community\/slider|@ptomasroos\/react-native-multi-slider|react-native-easy-view-transformer)/;

module.exports = {
	entry: entries(),
	output: {
		path: path.join(__dirname, 'webapp'),
		filename: 'app.bundle.js',
		publicPath: '/',
	},
	node: {
		global: true,
	},
	devtool: isProduction() ? false : 'cheap-module-source-map',
	mode: isProduction() ? 'production' : 'development',
	resolve: {
		alias: {
			'react-native-linear-gradient': 'react-native-web-linear-gradient',
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
		contentBase: path.resolve(__dirname),
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
				test: /\.ts$|\.tsx$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							babelrc: false,
							configFile: false,
							presets: [
								'module:metro-react-native-babel-preset',
								'@babel/preset-env',
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
								['@babel/plugin-proposal-class-properties', {loose: true}],
								isProduction() ? null : require.resolve('react-refresh/babel'),
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
				test: /\.js$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							babelrc: false,
							configFile: false,
							presets: [
								'module:metro-react-native-babel-preset',
								'@babel/preset-env',
							],
							plugins: [
								['@babel/plugin-proposal-class-properties', {loose: true}],
								isProduction() ? null : require.resolve('react-refresh/babel'),
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
