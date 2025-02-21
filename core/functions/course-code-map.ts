import {AppLanguage} from '../models/app-language';
import rawStrings from '../raw-strings';

export const courseCodeMap = {
	AST: 'Astrophysics',
	BIO: 'Biologie',
	BCH: 'Biochemie',
	BME: 'Biomedicine',
	CMS: 'Soft Skills competence Communication-Management-Leadership',
	CHE: 'Chemie',
	ESS: 'Erdsystemwissenschaften',
	GEO: 'Geographie',
	ESC: 'Computational Science',
	EPI: 'Epidemiology',
	INI: 'Neuroinformatics',
	MAT: 'Mathematik',
	PHY: 'Physik',
	STA: 'Statistik',
	UWW: 'Umweltwissenschaften',
};

export const getReadableGroupName = (group: string, language: AppLanguage) => {
	if (!courseCodeMap[group]) {
		return `${group}${rawStrings.X_GROUP[language]}`;
	}

	return `${group}${rawStrings.X_GROUP[language]} (${courseCodeMap[group]})`;
};
