export const normalizeWhitespace = (str: string) => {
	return (
		str
			// eslint-disable-next-line no-control-regex
			.replace(/[\u202F\u000A\u00A0]/g, ' ')
			.replace(/&nbsp;/g, ' ')
			.trim()
	);
};
