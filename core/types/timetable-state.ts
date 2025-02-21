import {PeriodHuman} from '../models/credit';

export type TimeTableState = {
	semester: null | PeriodHuman;
	weeks: {[key: string]: number};
};
