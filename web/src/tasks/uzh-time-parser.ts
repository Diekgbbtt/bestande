import timezone from 'moment-timezone';

export const parseUzhDate = (date: string): number => {
	const match = /^\/Date\(([0-9]+)\)\/$/.exec(date);
	if (!match) {
		throw new Error('Invalid date');
	}

	const [, timestamp] = match;
	return parseInt(timestamp, 10);
};

export const parseUzhTime = (time: string): number => {
	const match = /^PT([0-9]{2})H([0-9]{2})M([0-9]{2})S$/.exec(time);
	if (!match) {
		throw new Error('Invalid time format');
	}

	const [, hours, minutes, seconds] = match;
	return (
		parseInt(hours, 10) * 3600 * 1000 +
		parseInt(minutes, 10) * 60 * 1000 +
		parseInt(seconds, 10) * 1000
	);
};

const parseUzhOffset = (date: string): number => {
	const d = parseUzhDate(date);
	const tz = timezone.tz.zone('Europe/Zurich') as timezone.MomentZone;

	return tz.utcOffset(d) * 1000 * 60;
};

export const makeDate = (date: string, time: string): Date => {
	return new Date(
		parseUzhDate(date) + parseUzhTime(time) + parseUzhOffset(date)
	);
};
