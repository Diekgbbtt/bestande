import {AppLanguage} from '../models/app-language';
import {periodToString} from './uzh-period';

export const renderSemester = (
	human: string | number,
	lang: AppLanguage
): string | null => {
	if (!human) {
		return null;
	}

	if (!isNaN(parseInt(String(human), 10))) {
		human = periodToString(human);
	}

	if (lang !== 'en') {
		return String(human);
	}

	const match = /(FS|HS)([0-9]{2})/.exec(String(human));
	if (!match) {
		return String(human);
	}

	const [, springorfall, year] = match;
	return `${springorfall === 'HS' ? 'Fall' : 'Spring'} '${year}`;
};
