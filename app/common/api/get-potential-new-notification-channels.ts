import partition from 'lodash/partition';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {getVisibleCredits} from '../../../core/functions/Credits';
import {getChatRoomIdentifier} from '../../../core/functions/get-chat-room-identifier';
import {getModuleId} from '../../../core/functions/get-module-id';
import {AppState} from '../../../core/types/app-state';
import {isCreditBooked} from './is-credit-booked';

export const getPotentialNewNotificationChannels = (state: AppState) => {
	const credits = getVisibleCredits(state);
	const [activeCredits] = partition(credits, (c) => isCreditBooked(c));

	const subscribedChannels = state.notifications.notificationSettings
		? state.notifications.notificationSettings.pushSubscriptions
		: [];

	const activeButNotSubscribedCreditsAndNotThis = activeCredits.filter((a) => {
		return !subscribedChannels.includes(
			getChatRoomIdentifier(
				getModuleId(a) as string,
				CreditHelpers.getInstitution(a)
			)
		);
	});
	return activeButNotSubscribedCreditsAndNotThis;
};
