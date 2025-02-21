import {Institution} from '../core/models/credit';
import {GradeStatistic} from '../core/types/grade-statistics';

export type GradeStatisticInsert = [
	string,
	number,
	number,
	string,
	boolean,
	Institution
];

export type Predefined = GradeStatistic;
