import {Institution} from '../models/credit';

export type SetInstitutionAction = {
	type: 'SET_INSTITUTION';
	institution: Institution;
};

export const SET_INSTITUTION = 'SET_INSTITUTION';

export const setInstitution = (
	institution: Institution
): SetInstitutionAction => ({
	type: 'SET_INSTITUTION',
	institution,
});
