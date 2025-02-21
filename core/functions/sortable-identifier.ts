import {isRomanNumeral} from './is-roman-numeral';

export const sortableIdentifier = (input: string) => {
	const parsedInt = parseFloat(input);
	if (!isNaN(parsedInt)) {
		let str = String(parsedInt);
		let intString = String(parseInt(input, 10));
		while (intString.length < 10) {
			str = '0' + str;
			intString = '0' + intString;
		}

		return str;
	}

	const output = isRomanNumeral(input);
	if (typeof output === 'number') {
		return sortableIdentifier(String(output));
	}

	return input;
};
