import {mapToUniSlug} from '../../../core/functions/uni-slug';
import Module, {
	SingleWebModuleState,
	WebModuleState,
} from '../../../core/models/module';
import {semesterFormatPeriod} from '../../../core/models/semester';
import {WebState} from '../../../core/types/web-state';
import {
	ErrorReceivingModule,
	ErrorUpdatingModule,
	ERROR_RECEIVING_MODULE,
	ERROR_UPDATING_MODULE,
	FetchModule,
	FETCH_MODULE,
	ModuleUpdated,
	ReceiveModule,
	RECEIVE_MODULE,
	RequestModuleUpdate,
	REQUEST_MODULE_UPDATE,
	UPDATE_MODULE,
} from '../actions/modules';

const defaultState: SingleWebModuleState = {
	loading: true,
	data: null,
	error: null,
	saving: false,
	resolved: null,
	semester: null,
};

export const getModule = (
	state: WebState,
	moduleId: string
): SingleWebModuleState => {
	const moduleState = state.modules[moduleId] || defaultState;
	if (moduleState.data) {
		// @ts-expect-error
		moduleState.data = new Module(moduleState.data);
	} else if (moduleState.resolved) {
		return getModule(state, moduleState.resolved);
	}

	return moduleState;
};

export const getSemester = (
	state: WebState,
	moduleId: string,
	semester: string
) => {
	const module = getModule(state, moduleId);
	if (!module.data) {
		return null;
	}

	if (semester) {
		return module.data.semesters.find(
			(mis) => semesterFormatPeriod(mis) === semester
		);
	}

	return module.data.semesters[0];
};

export const modules = (
	state: WebModuleState = {},
	action:
		| FetchModule
		| ReceiveModule
		| ErrorReceivingModule
		| RequestModuleUpdate
		| ModuleUpdated
		| ErrorUpdatingModule
): WebModuleState => {
	switch (action.type) {
		case FETCH_MODULE:
			return {
				...state,
				[action.moduleId]: {
					...defaultState,
					loading: true,
					data: null,
					error: null,
				},
			};
		case RECEIVE_MODULE: {
			const identifier =
				mapToUniSlug(action.data.university) + '/' + action.data.uni_identifier;
			return {
				...state,
				// If it's a slug, store a reference to the uni identifier
				[action.moduleId]: {
					...defaultState,
					loading: false,
					data: null,
					resolved: identifier,
					error: null,
				},
				[identifier]: {
					...defaultState,
					loading: false,
					data: action.data,
					error: null,
				},
			};
		}

		case ERROR_RECEIVING_MODULE:
			return {
				...state,
				[action.moduleId]: {
					...defaultState,
					loading: false,
					data: null,
					error: action.err,
				},
			};

		case REQUEST_MODULE_UPDATE: {
			return {
				...state,
				[action.moduleId]: {
					...state[action.moduleId],
					saving: true,
				},
			};
		}

		case UPDATE_MODULE: {
			// @ts-expect-error
			return {
				...state,
				[action.moduleId]: {
					...state[action.moduleId],
					saving: false,
					data: {
						...state[action.moduleId].data,
						...action.update,
					},
				},
			};
		}

		case ERROR_UPDATING_MODULE: {
			return {
				...state,
				[action.moduleId]: {
					...state[action.moduleId],
					saving: false,
				},
			};
		}

		default:
			return state;
	}
};
