import timezone from 'moment-timezone';

const tz = timezone.tz.zone('Europe/Zurich') as timezone.MomentZone;

export const adjustZurichTimezone = (input: Date): Date => {
	return new Date(
		input.getTime() +
			(tz.utcOffset(input.getTime()) - input.getTimezoneOffset()) * 1000 * 60
	);
};
