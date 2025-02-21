'use strict';

import bodyParser from 'body-parser';
import express from 'express';
import {Institution} from '../core/models/credit';
import {UZH} from '../core/models/university';
import {InsertGradePayload} from '../core/types/grade-statistics';
import {deleteUser, getAllStats, insertStats, studentIsOptedIn} from './db';
import {handleRepeatExams} from './handle-repeat-exams';
import {GradeStatisticInsert} from './types';

export const gradeStatisticsRouter = express.Router();
gradeStatisticsRouter.use(bodyParser.json());

function successHandler(response: any, data = {}) {
	response.json(Object.assign(data, {success: true}));
}

function errorHandler(response: any, error: Error) {
	response.status(400).json({
		success: false,
		error: error.message,
	});
}

gradeStatisticsRouter.post('/', async (request, response) => {
	try {
		const payload = request.body;
		payload.grades = handleRepeatExams(payload.grades);
		await deleteUser(request.body.user);
		await insertStats(
			payload.grades.map(
				(g: InsertGradePayload): GradeStatisticInsert => [
					request.body.user,
					g.module,
					g.grade,
					g.semester,
					g.repeated,
					g.institution || UZH,
				]
			)
		);
		successHandler(response);
	} catch (error) {
		errorHandler(response, error);
	}
});

gradeStatisticsRouter.get(
	'/:institution(ETH|UZH)/:module',
	async (request, response) => {
		try {
			const stats = await getAllStats(
				request.params.module,
				request.params.institution as Institution
			);
			successHandler(response, stats);
		} catch (err) {
			errorHandler(response, err);
		}
	}
);

gradeStatisticsRouter.get('/:module', async (request, response) => {
	try {
		const stats = await getAllStats(request.params.module, UZH);
		successHandler(response, stats);
	} catch (error) {
		errorHandler(response, error);
	}
});

gradeStatisticsRouter.post('/opted-in', async (request, response) => {
	try {
		const optedIn = await studentIsOptedIn(request.body.user);

		successHandler(response, {
			optedIn,
		});
	} catch (error) {
		errorHandler(response, error);
	}
});

gradeStatisticsRouter.delete('/', async (request, response) => {
	try {
		const {user} = request.body;
		const optedIn = await studentIsOptedIn(user);
		if (optedIn) {
			await deleteUser(user);
		}

		successHandler(response);
	} catch (error) {
		errorHandler(response, error);
	}
});
