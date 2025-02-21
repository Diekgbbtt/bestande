import {createSelector} from 'reselect';
import {getChatRoomIdentifier} from '../../../core/functions/get-chat-room-identifier';
import {Institution} from '../../../core/models/credit';
import {initialModuleState} from '../../../core/reducers/api';
import {ApiReducerState} from '../../../core/types/api-reducer-state';
import {AppState} from '../../../core/types/app-state';

export const getApiResponse = createSelector(
	[
		(state: AppState) => state.api,
		(state: AppState, institution: Institution) => institution,
		(state: AppState, institution: Institution, uni_identifier: string) =>
			uni_identifier,
	],
	(api: ApiReducerState, institution: Institution, uni_identifier: string) =>
		api[getChatRoomIdentifier(uni_identifier, institution)] ||
		initialModuleState
);
