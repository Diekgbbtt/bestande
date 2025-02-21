import {AppLanguage} from '../models/app-language';
import {
	MEF,
	MNF,
	MOB,
	PHF,
	RWF,
	THF,
	UZHFaculty,
	VSF,
	WWF,
} from '../models/uzh-faculties';
import rawStrings from '../raw-strings';

export const translate = (german: string, language: AppLanguage) => {
	const faculties = [
		'ECONOMICS',
		'MEDICINE',
		'PHILOSOPHY',
		'LAW',
		'THEOLOGY',
		'MATHEMATICS_NAT_SCIENCES',
	];
	const key = faculties.find((f) => rawStrings[f].de === german);
	if (key) {
		return rawStrings[key][language];
	}

	return german;
};

export const uzhFacultyLabel = (
	faculty: UZHFaculty,
	lang: AppLanguage = 'de'
): string | null => {
	switch (faculty) {
		case WWF:
			return rawStrings.ECONOMICS[lang];
		case MEF:
			return rawStrings.MEDICINE[lang];
		case PHF:
			return rawStrings.PHILOSOPHY[lang];
		case RWF:
			return rawStrings.LAW[lang];
		case THF:
			return rawStrings.THEOLOGY[lang];
		case VSF:
			return 'Vetsuisse';
		case MOB:
			return 'Mobility';
		case MNF:
			return rawStrings.MATHEMATICS_NAT_SCIENCES[lang];
		default:
			return null;
	}
};
