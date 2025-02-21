import {CourseRating} from './ratings';

export type SingleModuleRatingState = {
	loading: boolean;
	data: CourseRating | null;
	error: null | Error;
	loadingMore?: boolean;
};

export type ModuleRatingsState = {
	ratings: {[key: string]: SingleModuleRatingState};
	addingRating: boolean;
	errorAddingRating: string | null;
};
