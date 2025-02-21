import {CreditStatus, Institution, UntypedCreditAmount} from '../models/credit';

export type CustomCredit = {
	name: string;
	_id: string;
	university?: Institution;
	short_name: string;
	period: number;

	credits_worth: UntypedCreditAmount;
	grade: string | null;
	custom: true;
	status: CreditStatus;
	credits_received: UntypedCreditAmount;
};

export type CustomCreditsState = {
	credits: CustomCredit[];
};

const initialState: CustomCreditsState = {
	credits: [],
};

export enum CustomCreditsTypes {
	ADD_CUSTOM_CREDITS = 'ADD_CUSTOM_CREDITS',
	REMOVE_CUSTOM_CREDIT = 'REMOVE_CUSTOM_CREDIT',
	SET_CUSTOM_CREDITS = 'SET_CUSTOM_CREDITS',
}

type AddCustomCredit = {
	type: CustomCreditsTypes.ADD_CUSTOM_CREDITS;
	credit: CustomCredit;
};

export const addCustomCredit = (credit: CustomCredit): AddCustomCredit => {
	return {
		type: CustomCreditsTypes.ADD_CUSTOM_CREDITS,
		credit,
	};
};

type RemoveCustomCredit = {
	type: CustomCreditsTypes.REMOVE_CUSTOM_CREDIT;
	_id: string;
};

export const removeCustomCredit = (_id: string): RemoveCustomCredit => {
	return {
		type: CustomCreditsTypes.REMOVE_CUSTOM_CREDIT,
		_id,
	};
};

type SetCustomCredits = {
	type: CustomCreditsTypes.SET_CUSTOM_CREDITS;
	credits: CustomCredit[];
};

export const setCustomCredits = (credits: CustomCredit[]): SetCustomCredits => {
	return {
		type: CustomCreditsTypes.SET_CUSTOM_CREDITS,
		credits,
	};
};

export const customCredits = (
	state: CustomCreditsState = initialState,
	action: AddCustomCredit | RemoveCustomCredit | SetCustomCredits
): CustomCreditsState => {
	switch (action.type) {
		case CustomCreditsTypes.ADD_CUSTOM_CREDITS:
			return {
				...state,
				credits: [...state.credits, action.credit],
			};
		case CustomCreditsTypes.REMOVE_CUSTOM_CREDIT:
			return {
				...state,
				credits: state.credits.filter((c) => {
					return c._id !== action._id;
				}),
			};
		case CustomCreditsTypes.SET_CUSTOM_CREDITS:
			return {
				...state,
				credits: action.credits,
			};
		default:
			return state;
	}
};
