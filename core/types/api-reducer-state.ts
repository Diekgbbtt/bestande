import {ApiResponse} from '../reducers/api';

export type ApiResponseState = {
	loading: boolean;
	details: ApiResponse | null;
	error: null | string;
	semester: string | null;
};

export type ApiReducerState = {[key: string]: ApiResponseState};
