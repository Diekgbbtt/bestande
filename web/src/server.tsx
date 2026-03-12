import aws from 'aws-sdk';
import express from 'express';
import subdomain from 'express-subdomain';
import https from 'https';
import http from 'http';
import passport from 'passport';
import path from 'path';
import s3Router from 'react-s3-uploader/s3router';
import swig from 'swig';
import session from 'express-session';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import api from './api';
import {authRouter} from './auth';
import createInitialStore from './initial-store';
import cookieParser from 'cookie-parser';
// import swaggerUi from 'swagger-ui-express';
// const swaggerFile = require('./swagger-output.json');
import fs from 'fs';
import {metricsScraperHandler, metricsMiddleware} from './metrics';



if (process.env.RAVEN) {
	const Raven = require('raven');
	Raven.config(process.env.RAVEN).install();
}

const createApp = () => {
	const app = express();
	app.use(cookieParser());
	app.use(metricsMiddleware);

	app.use((req, res, next) => {
		if (req.hostname.startsWith('www.bestande.ch')) {
			// req.originalURL is for example: /profile
			const newUrl = `https://bestande.ch${req.originalUrl}`;
			res.redirect(301, newUrl);
		} else {
			next();
		}
	});

	// Webpack
	if (process.env.NODE_ENV === 'development') {
		const webpackConfig = require('../webpack.config');
		const compiler = webpack({...webpackConfig, mode: 'development'});
		app.use(
			devMiddleware(compiler, {
				publicPath: webpackConfig.output.publicPath,
			})
		);

		app.use(
			hotMiddleware(compiler, {
				path: '/__webpack_hmr',
			})
		);
	}

	const server =
		process.env.NODE_ENV === 'development' && process.env.PORT === '443'
			? https.createServer(
					{
						key: fs.readFileSync('../key.pem'),
						cert: fs.readFileSync('../cert.pem'),
					},
					app
			  )
			: http.createServer(app);

	app.use(
		session({
			secret: 'bestande-session-secret',
			resave: false,
			saveUninitialized: false,
		})
	);
	app.use(passport.initialize());
	app.use(passport.session());
	// app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
	app.use('/auth', authRouter);
	app.use('/api', api);
	app.use(subdomain('api', api));
	app.use(subdomain('events', app));
	app.get('/static/OneSignalSDKWorker.js', (req, res) => {
		res.set('Service-Worker-Allowed', '/');
		res.sendFile(path.join(__dirname, 'static', 'OneSignalSDKWorker.js'));
	});

	// General static files serving
	app.use('/static', express.static(path.join(__dirname, 'static')));

	// View settings
	app.engine('html', swig.renderFile);
	app.set('view engine', 'html');
	app.set('views', path.join(__dirname, '/html'));

	// The robots.txt file
	app.get('/robots.txt', (request, response) => {
		if (/beta/.exec(request.hostname)) {
			const robotstxt = ['User-agent: *', 'Disallow: /'].join('\n');
			response.end(robotstxt);
		}

		return response.status(404).end('');
	});

	// Amazon S3 upload API
	aws.config.update({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	});
	const digitalOceanSpacesEndpoint = new aws.Endpoint(
		'fra1.digitaloceanspaces.com'
	);
	app.use(
		'/s3',
		s3Router({
			bucket: 'bestande',
			getS3: () =>
				new aws.S3({
					endpoint: digitalOceanSpacesEndpoint,
					params: {Bucket: 'proper-public'},
				}),
			signatureVersion: 'v4',
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			ACL: 'public-read',
			uniquePrefix: true,
		})
	);

	app.get('/notenstatistiken', (request, response) => {
		response.render('notenstatistiken');
	});

	// Initial state
	app.use((request, response) => {
		try {
			// @ts-expect-error
			const store = createInitialStore(request.user);

			response.render('index', {
				state: store.getState(),
			});
		} catch (err) {
			console.log(err);
		}
	});

	// HTTP metrics collection endpoint for Prometheus
	app.get('/metrics', metricsScraperHandler);

	// app.get('/metrics', (request, response) => { });


	return server;
};

export default createApp;
