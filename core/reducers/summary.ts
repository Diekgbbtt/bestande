import {
	DidLogOutAction,
	LoginSuccessAction,
	LOGIN_SUCCESS,
	LOGOUT,
	RemoveLoginCredit,
	REMOVE_LOGIN_CREDIT,
} from '../actions/login';
import {CreditHelpers} from '../functions/CreditHelpers';
import {getModuleId} from '../functions/get-module-id';
import {Institution} from '../models/credit';
import {UzhLoginResponse} from '../types/uzh-login';

type Actions = LoginSuccessAction | DidLogOutAction | RemoveLoginCredit;

const reducer = function (
	state: UzhLoginResponse | null = null,
	action: Actions,
	institution: Institution
) {
	if (institution && institution !== action.institution) {
		return state;
	}

	switch (action.type) {
		case LOGIN_SUCCESS:
			return action.response;
		case LOGOUT:
			return null;
		case REMOVE_LOGIN_CREDIT: {
			if (!state) {
				return state;
			}

			return {
				...state,
				credits: state.credits.filter((c) => {
					return !(
						getModuleId(c) === getModuleId(action.credit) &&
						CreditHelpers.getSemester(c) ===
							CreditHelpers.getSemester(action.credit)
					);
				}),
			};
		}

		default:
			return state;
	}
};

export const institutionReducer = (institution: Institution) => {
	return (state: UzhLoginResponse | null, action: Actions) =>
		reducer(state, action, institution);
};
