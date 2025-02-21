import uniqBy from 'lodash/uniqBy';
import ms from 'ms';

type OnlineEvent = {
	userId: string;
	time: number;
};

const onlineUserMap: {[key in string]: OnlineEvent[]} = {};

const threshold = ms('1h');

const tidyUp = (channelId: string) => {
	if (!onlineUserMap[channelId]) {
		onlineUserMap[channelId] = [];
		return;
	}

	onlineUserMap[channelId] = uniqBy(
		onlineUserMap[channelId].filter((e) => Date.now() - e.time < threshold),
		(e) => e.userId
	);
};

export const registerUserLoggedIn = (channelId: string, userId: string) => {
	tidyUp(channelId);

	onlineUserMap[channelId].unshift({
		userId,
		time: Date.now(),
	});
};

export const getActiveUsersNoInLastHour = (channelId: string) => {
	tidyUp(channelId);
	return onlineUserMap[channelId].length;
};
