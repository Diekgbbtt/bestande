import {ThunkDispatch} from 'redux-thunk';
import {getModule} from '../functions/api';
import {mapToUniSlug} from '../functions/uni-slug';
import {Institution} from '../models/credit';
import {ApiResponse} from '../reducers/api';

export const FETCH_MODULE_DETAILS = 'FETCH_MODULE_DETAILS';
export const RECEIVE_MODULE_DETAILS = 'RECEIVE_MODULE_DETAILS';
export const MODULE_DETAILS_ERROR = 'MODULE_DETAILS_ERROR';
export const SET_MODULE_SEMESTER = 'SET_MODULE_SEMESTER';

export type FetchModuleDetailsAction = {
	type: 'FETCH_MODULE_DETAILS';
	moduleId: string;
	institution: Institution;
};

const fetchModuleDetailsAction = (
	institution: Institution,
	moduleId: string
): FetchModuleDetailsAction => {
	return {
		institution,
		type: FETCH_MODULE_DETAILS,
		moduleId,
	};
};

export type ReceiveModuleDetailsAction = {
	type: 'RECEIVE_MODULE_DETAILS';
	moduleId: string;
	details: ApiResponse;
	institution: Institution;
};

const receiveModuleDetails = (
	institution: Institution,
	moduleId: string,
	details: ApiResponse
): ReceiveModuleDetailsAction => {
	return {
		type: RECEIVE_MODULE_DETAILS,
		moduleId,
		details,
		institution,
	};
};

export type ModuleDetailsFetchError = {
	type: 'MODULE_DETAILS_ERROR';
	moduleId: string;
	err: Error;
	institution: Institution;
};

const moduleDetailsError = (
	institution: Institution,
	moduleId: string,
	err: Error
): ModuleDetailsFetchError => {
	return {
		type: MODULE_DETAILS_ERROR,
		moduleId,
		err,
		institution,
	};
};

export type SetSemesterAction = {
	type: 'SET_MODULE_SEMESTER';
	moduleId: string;
	semester: string;
	institution: Institution;
};

export const setSemester = (
	institution: Institution,
	moduleId: string,
	semester: string
): SetSemesterAction => {
	return {
		type: SET_MODULE_SEMESTER,
		moduleId,
		semester,
		institution,
	};
};

export const fetchModuleDetails = (
	institution: Institution,
	moduleId: string
) => {
	return async (dispatch: ThunkDispatch<{}, {}, any>) => {
		dispatch(fetchModuleDetailsAction(institution, moduleId));
		try {
			const data = await getModule(mapToUniSlug(institution), moduleId);
			dispatch(receiveModuleDetails(institution, moduleId, data));
		} catch (err) {
			dispatch(moduleDetailsError(institution, moduleId, err));
		}
	};
};
