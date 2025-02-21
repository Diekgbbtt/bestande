import {Institution} from '../models/credit';

export type SemesterGradeStat = {
	average: number | null;
	semester: string;
	passed: number;
	failed: number;
	count: number;
	stddev: number | null;
	comment: string | null;
	source: string | null;
	source_link: string | null;
};

type Stats = {
	distribution: number[];
	success: boolean;
	total: {
		average: number | null;
		count: number;
		failed: number;
		median: number;
		passed: number;
		stddev: number | null;
	};
	detailed: SemesterGradeStat[];
};
export type SingleGradeState = {
	loading: boolean;
	stats: Stats | null;
	error: Error | null;
};

export type GradeStatisticsState = {
	[key: string]: SingleGradeState;
};

export type GradeStatistic = {
	average: number;
	semester: string;
	passed: number;
	failed: number;
	count: number;
	module?: string | number;
	source_link: string | null;
	stddev: number | null;
	comment: string | null;
	source: string | null;
	institution?: Institution;
};

export type StatisticsResponse = {
	total: {
		failed: number;
		count: number;
		average: number;
		median: number;
		passed: number;
		stddev: number | null;
	};
	detailed: GradeStatistic[];
	distribution: number[];
	success: true;
};

export type GradeStatisticsReducerType = {
	[key: string]: SingleGradeState;
};

export type InsertGradePayload = {
	module: number;
	grade: number;
	semester: string;
	repeated: boolean;
	institution: Institution;
};
