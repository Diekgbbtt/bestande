import uniq from 'lodash/uniq';

export const HIDE_CONTENT = 'HIDE_CONTENT';
export const RESET_HIDDEN = 'RESET_HIDDEN';
export const SET_HIDDEN_CONTENT = 'SET_HIDDEN_CONTENT';

type SetHiddenContent = {
	type: 'SET_HIDDEN_CONTENT';
	content: string[];
};

export const setHiddenContent = (content: string[]): SetHiddenContent => {
	return {
		type: SET_HIDDEN_CONTENT,
		content,
	};
};

type ResetHiddenContent = {
	type: 'RESET_HIDDEN';
};

// ts-unused-exports:disable-next-line
export const resetHiddenContent = (): ResetHiddenContent => {
	return {
		type: RESET_HIDDEN,
	};
};

type HideContent = {
	type: 'HIDE_CONTENT';
	content: string;
};

export const hideContent = (content: string): HideContent => {
	return {
		type: HIDE_CONTENT,
		content,
	};
};

export type HiddenContentState = string[];

export const hiddenContent = (
	state: HiddenContentState = [],
	action: HideContent | ResetHiddenContent | SetHiddenContent
): HiddenContentState => {
	switch (action.type) {
		case HIDE_CONTENT:
			return uniq([...state, action.content]);
		case RESET_HIDDEN:
			return [];
		case SET_HIDDEN_CONTENT:
			return action.content;
		default:
			return state;
	}
};
