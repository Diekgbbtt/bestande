import {SetInstitutionAction, SET_INSTITUTION} from '../actions/institution';
import {UZH} from '../models/university';
import {InstitutionState} from '../types/institution-state';

const initialState: InstitutionState = {
	institution: UZH,
};

export const institution = function (
	state = initialState,
	action: SetInstitutionAction
) {
	switch (action.type) {
		case SET_INSTITUTION:
			return {
				...state,
				institution: action.institution,
				picker: false,
			};
		default:
			return state;
	}
};
