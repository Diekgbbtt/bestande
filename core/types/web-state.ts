import {AppLanguage} from '../models/app-language';
import {WebModuleState} from '../models/module';
import {ExamReturnState} from '../reducers/exam-returns';
import {WebLoginState} from '../reducers/web-login';
import {PeopleState} from '../types/people-state';
import {AppearanceState} from './appearance-state';
import {ChatServerState} from './chat';
import {AppFoodState} from './food';
import {GradeStatisticsState} from './grade-statistics';
import {InstitutionState} from './institution-state';
import {ModalsState} from './modals';
import {ModuleRatingsState} from './module-ratings-state';
import {PromotionState} from './promotion-state';
import {RatingState} from './ratings';
import {ScheduleState} from './schedule';
import {UserState} from './user-state';

export type WebState = {
	modules: WebModuleState;
	login: WebLoginState;
	people: PeopleState;
	promotions: PromotionState;
	gradeStatistics: GradeStatisticsState;
	ratings: RatingState;
	moduleRatings: ModuleRatingsState;
	food: AppFoodState;
	schedule: ScheduleState;
	language: {
		selectedLanguage: AppLanguage;
	};
	appearance: AppearanceState;
	chatServer: ChatServerState;
	users: UserState;
	modals: ModalsState;
	institution: InstitutionState;
	examReturns: ExamReturnState;
};
