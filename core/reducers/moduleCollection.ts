import {CreditHelpers} from '../functions/CreditHelpers';
import {getModuleId} from '../functions/get-module-id';
import {Credit, CustomModule, ModuleCollection} from '../models/credit';

const initialState: ModuleCollection = [];

export const ADD_MODULES = 'ADD_MODULES';
export const REMOVE_MODULE = 'REMOVE_MODULE';
export const SET_MODULES = 'SET_MODULES';

export type AddModules = {
	type: 'ADD_MODULES';
	modules: CustomModule[];
};

export const addModules = (modules: CustomModule[]): AddModules => ({
	type: ADD_MODULES,
	modules,
});

export type RemoveModule = {
	type: 'REMOVE_MODULE';
	credit: CustomModule | Credit;
};

export const removeModule = (credit: CustomModule | Credit): RemoveModule => ({
	type: REMOVE_MODULE,
	credit,
});

type SetModules = {
	type: 'SET_MODULES';
	modules: CustomModule[];
};

export const setModules = (modules: CustomModule[]): SetModules => ({
	type: SET_MODULES,
	modules,
});

export const moduleCollection = (
	state: ModuleCollection = initialState,
	action: AddModules | RemoveModule | SetModules
) => {
	switch (action.type) {
		case ADD_MODULES:
			return [...state, ...action.modules];
		case REMOVE_MODULE:
			return state.filter(
				(m) =>
					!(
						m.uni_identifier === getModuleId(action.credit) &&
						m.period === CreditHelpers.getPeriod(action.credit) &&
						m.university === CreditHelpers.getInstitution(action.credit)
					)
			);
		case SET_MODULES:
			return [...action.modules];
		default:
			return state;
	}
};
