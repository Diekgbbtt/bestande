import ms from 'ms';

export const hasToWaitToSendMoreMessages = (
	lastMessagesTimestamps: number[],
	maxMessagesPerMinute: number
) =>
	lastMessagesTimestamps.filter(
		(timestamp) => Date.now() - timestamp < ms('60s')
	).length > maxMessagesPerMinute;
