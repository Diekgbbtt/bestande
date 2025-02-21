import {apiRequest} from '../../../core/functions/api-request';
import { mapToUniSlug } from '../../../core/functions/uni-slug';
import {Institution} from '../../../core/models/credit';
import {ApiResponse} from '../../../core/reducers/api';

export const FETCH_MODULE = 'FETCH_MODULE';
export const RECEIVE_MODULE = 'RECEIVE_MODULE';
export const ERROR_RECEIVING_MODULE = 'ERROR_RECEIVING_MODULE';

export const REQUEST_MODULE_UPDATE = 'REQUEST_MODULE_UPDATE';
export const UPDATE_MODULE = 'UPDATE_MODULE';
export const ERROR_UPDATING_MODULE = 'ERROR_UPDATING_MODULE';

export type ReceiveModule = {
	type: 'RECEIVE_MODULE';
	moduleId: string;
	data: ApiResponse;
};

const receiveModule = (moduleId: string, data: ApiResponse): ReceiveModule => {
	return {
		type: RECEIVE_MODULE,
		moduleId,
		data,
	};
};

export type ErrorReceivingModule = {
	type: 'ERROR_RECEIVING_MODULE';
	moduleId: string;
	err: Error;
};

const errorReceivingModule = (
	moduleId: string,
	err: Error
): ErrorReceivingModule => {
	return {
		type: ERROR_RECEIVING_MODULE,
		moduleId,
		err,
	};
};

export type ModuleUpdated = {
	type: 'UPDATE_MODULE';
	moduleId: string;
	update: Partial<ApiResponse>;
};

export type ErrorUpdatingModule = {
	type: 'ERROR_UPDATING_MODULE';
	moduleId: string;
};

export type FetchModule = {
	type: 'FETCH_MODULE';
	moduleId: string;
};

const fetchModuleAction = (moduleId: string): FetchModule => ({
	type: FETCH_MODULE,
	moduleId,
});

export const fetchModule = (institution: Institution, moduleId: string) => {
	const identifier = mapToUniSlug(institution) + '/' + moduleId;
	return async (dispatch) => {
		dispatch(fetchModuleAction(identifier));
		try {
			const data = await apiRequest<ApiResponse>(
				`/institution/${mapToUniSlug(institution)}/module/${moduleId}`
			);
			dispatch(receiveModule(identifier, data));
		} catch (err) {
			dispatch(errorReceivingModule(identifier, err));
		}
	};
};

export type RequestModuleUpdate = {
	type: 'REQUEST_MODULE_UPDATE';
	moduleId: string;
};
