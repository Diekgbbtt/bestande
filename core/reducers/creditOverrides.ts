import {getUniqueIdentifier} from '../functions/get-unique-identifier';
import {
	Credit,
	CreditStatus,
	CustomModule,
	UntypedCreditAmount,
	UntypedGrade,
} from '../models/credit';
import {RemoveModule, REMOVE_MODULE} from './moduleCollection';

export const SET_OVERRIDE = 'SET_OVERRIDE';
const RESET_OVERRIDE = 'RESET_OVERRIDE';
export const SET_OVERRRIDE_MAP = 'SET_OVERRRIDE_MAP';

export type Override = {
	grade: UntypedGrade;
	status: CreditStatus;
	credits_received?: UntypedCreditAmount;
	period?: number;
};

export type CreditOverrideState = {
	[key: string]: Override;
};

export type SetOverrideAction = {
	type: 'SET_OVERRIDE';
	credit: Credit | CustomModule;
	override: Override;
	source: 'local' | 'pull';
};
export const setOverride = (
	credit: Credit | CustomModule,
	override: Override,
	source: 'local' | 'pull'
): SetOverrideAction => {
	return {
		type: 'SET_OVERRIDE',
		credit,
		override,
		source,
	};
};

type SetOverrideMapAction = {
	type: 'SET_OVERRRIDE_MAP';
	overrides: CreditOverrideState;
};

type ResetOverride = {
	type: 'RESET_OVERRIDE';
	credit: Credit | CustomModule;
};

export const resetOverride = (credit: Credit | CustomModule): ResetOverride => {
	return {
		type: 'RESET_OVERRIDE',
		credit,
	};
};

export const creditOverridesReducer = (
	state: CreditOverrideState = {},
	action:
		| SetOverrideAction
		| SetOverrideMapAction
		| ResetOverride
		| RemoveModule
) => {
	switch (action.type) {
		case SET_OVERRIDE:
			return {
				...state,
				[getUniqueIdentifier(action.credit)]: {
					...state[getUniqueIdentifier(action.credit)],
					...action.override,
				},
			};
		case SET_OVERRRIDE_MAP:
			return action.overrides;
		case RESET_OVERRIDE:
			return {
				...state,
				[getUniqueIdentifier(action.credit)]: {},
			};
		case REMOVE_MODULE:
			return {
				...state,
				[getUniqueIdentifier(action.credit)]: {},
			};
		default:
			return state;
	}
};
