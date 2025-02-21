declare module 'opening_hours' {
	class OH {
		constructor(hours: string);
		getState: (date: Date) => boolean;
		getComment: (date: Date) => string;
		getNextChange: (date: Date) => Date;
		getOpenIntervals: (
			date: Date,
			date2: Date
		) => [number, number, any, string][];
	}
	export default OH;
}
