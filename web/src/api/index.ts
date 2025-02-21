import bodyParser from 'body-parser';
import cors from 'cors';
import {Router} from 'express';
import {gradeStatisticsRouter} from '../../../grade-statistics/server';
import {asyncNextHandler} from '../handlers';
import {accountRouter} from './account';
import {router as chatRouter} from './chat';
import {documentsRouter} from './documents';
import {examReturnsRouter} from './examreturns';
import institutionRouter from './institution';
import studentsRouter from './students/me';
import notificationsRouter from './notifications';
import promotionRouter from './promotions';
import ratingsRouter from './ratings';
import redirectRouter from './redirect';
import statsRouter from './stats';
import statusRouter from './status';
import tasksRouter from './tasks';
import {get} from 'lodash';
import {getOwnDomain} from '../domain';

const router = Router();

const whitelist = [
	'http://localhost:8080',
	'http://localhost:3000',
	'http://localhost:5000',
	'https://bestande.ch',
	'https://www.bestande.ch',
	'https://alpha.bestande.app',
	'https://bestande.app',
	'https://bestande-d456fe7ae969.herokuapp.com',
	'https://desolate-retreat-80573-e5db0ca6f38d.herokuapp.com',
	'https://bestande-production-d690091e0220.herokuapp.com',
	'https://staging.bestande.ch',
	'https://monkfish-app-xkgk7.ondigitalocean.app',
	getOwnDomain(),
];

if (process.env.NODE_ENV === 'production') {
	const corsOptions = {
		origin(
			origin: string | undefined,
			callback: (err: Error | null, allowed?: boolean) => void
		): void {
			if (
				!origin ||
				whitelist.includes(origin) ||
				origin.startsWith('http://192.168') ||
				origin.endsWith('stormkit.dev') ||
				(origin.startsWith('https://tmp-') &&
					origin.endsWith('.ondigitalocean.app'))
			) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
	};
	router.use(cors(corsOptions));
} else {
	router.use(cors({}));
}

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.use(
	asyncNextHandler(async (request, response, next) => {
		// Add hook so we can test authenticated users
		if (process.env.TEST) {
			request.user = {
				display_name: 'Jonny Burger',
				emails: [
					{
						value: 'jonathanburger11@gmail.com',
						verified: true,
					},
				],
			};
		}

		next();
	})
);

router.get('/', (request, response) => {
	response.end('This is the API');
});

router.use('/promotions', promotionRouter);
router.use('/institution', institutionRouter);
router.use('/me', studentsRouter);
router.use('/stats', statsRouter);
router.use('/status', statusRouter);
router.use('/tasks', tasksRouter);
router.use('/ratings', ratingsRouter);
router.use('/redirect', redirectRouter);
router.use('/documents', documentsRouter);
router.use('/chat', chatRouter);
router.use('/notifications', notificationsRouter);
router.use('/examreturns', examReturnsRouter);
router.use('/account', accountRouter);
if (process.env.PGUSER && !process.env.CI) {
	router.use('/grades', gradeStatisticsRouter);
}

router.use((request, response) => {
	response.status(404).end('404 Not found');
});

export default router;
