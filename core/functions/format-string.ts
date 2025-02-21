export const formatString = (
	str: string,
	...replacements: string[]
): string => {
	for (let i = 0; i < replacements.length; i++) {
		str = str.replace(`{${i}}`, replacements[i]);
	}

	return str;
};
