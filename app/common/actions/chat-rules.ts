import {hideContent} from '../../../core/reducers/hiddenContent';
import {AppState} from '../../../core/types/app-state';

const identifier = 'chat-rules';

export const didAcceptChatRules = (state: AppState) => {
	return state.hiddenContent.includes(identifier);
};

export const acceptChatRules = () => {
	return hideContent(identifier);
};
