export type SelectedMessagesState = {
	selected: string[];
};

type SelectMessage = {
	type: 'select-message';
	messageId: string;
};
type UnselectMessage = {
	type: 'unselect-message';
	messageId: string;
};
type UnselectAll = {
	type: 'unselect-all';
};

type Action = SelectMessage | UnselectMessage | UnselectAll;

export const selectedMessages = (
	state: SelectedMessagesState = {selected: []},
	action: Action
): SelectedMessagesState => {
	if (action.type === 'select-message') {
		return {
			...state,
			selected: [...state.selected, action.messageId],
		};
	}

	if (action.type === 'unselect-message') {
		return {
			...state,
			selected: state.selected.filter((s) => s !== action.messageId),
		};
	}

	if (action.type === 'unselect-all') {
		return {
			...state,
			selected: [],
		};
	}

	return state;
};

export const selectMessage = (messageId: string): SelectMessage => ({
	type: 'select-message',
	messageId,
});
export const unselectMessage = (messageId: string): UnselectMessage => ({
	type: 'unselect-message',
	messageId,
});
export const unselectAll = (): UnselectAll => ({type: 'unselect-all'});
