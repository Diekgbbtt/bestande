import {ThunkDispatch} from 'redux-thunk';
import {loadMessages} from '../functions/api';
import {Institution} from '../models/credit';
import {
	errorLoadingPreviousMessages,
	loadedPreviousMessages,
	startLoadingPreviousMessages,
} from '../reducers/chat-server';

export const fetchPreviousMessages = (
	uni_identifier: string,
	university: Institution | null,
	limit: number,
	before: number,
	clearExisting: boolean
) => {
	return async (dispatch: ThunkDispatch<{}, {}, any>) => {
		dispatch(startLoadingPreviousMessages(uni_identifier, university));
		try {
			const {data} = await loadMessages(
				university,
				uni_identifier,
				limit,
				before
			);
			dispatch(
				loadedPreviousMessages(
					uni_identifier,
					university,
					data.messages,
					data.systemMessages || [],
					data.availableBefore,
					data.users,
					clearExisting
				)
			);
		} catch (err) {
			dispatch(errorLoadingPreviousMessages(uni_identifier, university, err));
		}
	};
};
