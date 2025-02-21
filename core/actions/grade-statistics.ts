import {getOnlyNumberIdentifier} from '../functions/get-only-number-identifier';
import {Institution} from '../models/credit';
import {DOMAIN} from '../models/domain';
import {UZH} from '../models/university';
import {StatisticsResponse} from '../types/grade-statistics';

export const STATISTIC_MODULE_REQUEST = 'STATISTIC_MODULE_REQUEST';
export const STATISTIC_MODULE_RESPONSE = 'STATISTIC_MODULE_RESPONSE';
export const STATISTIC_MODULE_ERROR = 'STATISTIC_MODULE_ERROR';

export type GradeStatisticRequestAction = {
	type: 'STATISTIC_MODULE_REQUEST';
	moduleid: string;
	institution: Institution;
};

function moduleRequest(moduleid: string, institution: Institution) {
	return {
		type: STATISTIC_MODULE_REQUEST,
		moduleid,
		institution,
	};
}

export type GradeStatisticResponseAction = {
	type: 'STATISTIC_MODULE_RESPONSE';
	moduleid: string;
	stats: StatisticsResponse;
	institution: Institution;
};

function moduleResponse(
	moduleid: string,
	stats: StatisticsResponse,
	institution: Institution
) {
	return {
		type: STATISTIC_MODULE_RESPONSE,
		moduleid,
		stats,
		institution,
	};
}

export type GradeStatisticsErrorAction = {
	type: 'STATISTIC_MODULE_ERROR';
	moduleid: string;
	error: Error;
	institution: Institution;
};

function moduleError(
	moduleid: string,
	error: Error,
	institution: Institution
): GradeStatisticsErrorAction {
	return {
		type: STATISTIC_MODULE_ERROR,
		moduleid,
		error,
		institution,
	};
}

export function makeRequest(institution: Institution = UZH, moduleid: string) {
	return async function (dispatch: {
		(arg0: {type: string; moduleid: string; institution: Institution}): void;
		(arg0: {
			type: string;
			moduleid: string;
			stats: StatisticsResponse;
			institution: Institution;
		}): void;
		(arg0: GradeStatisticsErrorAction): void;
		(arg0: GradeStatisticsErrorAction): void;
	}) {
		dispatch(moduleRequest(moduleid, institution));

		try {
			const response = await fetch(
				`${DOMAIN}/grades/${institution}/${getOnlyNumberIdentifier(moduleid)}`
			);
			const json = await response.json();
			if (json.success) {
				dispatch(moduleResponse(moduleid, json, institution));
			} else {
				dispatch(moduleError(moduleid, new Error(json.error), institution));
			}
		} catch (err) {
			dispatch(moduleError(moduleid, err, institution));
		}
	};
}
