import xns from 'xns';
import {connectGradeStatics} from '../../grade-statistics/db';
import {chat} from './api/chat';
import {connectToMongo} from './db/modern';
import {recurringTasks} from './queue';
import createApp from './server';
import {doMultipleTasks} from './task-queue/do-tasks';
// So the variables from the .env file in the /web directory are available
require('dotenv').config();

const startQueue = async () => {
	console.log('Doing tasks...');
	await doMultipleTasks(1);
	setTimeout(() => {
		startQueue()
			.then(() => {
				console.log('Done doing tasks');
			})
			.catch((err) => {
				console.log('Error doing tasks', err);
			});
	}, 10000);
};

xns(async () => {
	if (process.env.WORKER) {
		recurringTasks();
		await startQueue();
	} else {
		await connectToMongo();
		if (process.env.PGUSER) {
			await connectGradeStatics();
		}

		const app = createApp();
		chat(app);
		if (process.env.PORT) {
			app.listen(process.env.PORT);
		} else {
			app.listen(3000, '0.0.0.0');
		}

		console.log(
			'App started.',
			new Date(),
			'http://localhost:' + (process.env.PORT || 3000)
		);

		await new Promise(() => {
			// noop
		});
	}
});
