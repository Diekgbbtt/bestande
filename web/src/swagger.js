const swaggerAutogen = require('swagger-autogen')();

const doc = {
	info: {
		title: 'Bestande API',
		description: 'This is the API documentation for the Bestande application.',
	},
	host: 'localhost:3000',
	basePath: '/',
	schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.tsx'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);
