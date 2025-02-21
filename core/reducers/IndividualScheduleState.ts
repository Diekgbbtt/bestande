import {Schedule} from '../types/schedule';

export type IndividualScheduleState = {
	loading: boolean;
	schedule: Schedule | null;
};
