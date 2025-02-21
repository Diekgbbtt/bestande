import romanNumerals from 'roman-numerals';

export const isRomanNumeral = (str: string): number | null => {
	try {
		return romanNumerals.toArabic(str);
	} catch (err) {
		return null;
	}
};
