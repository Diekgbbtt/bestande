import {AppLanguage} from '../models/app-language';
import {Repeatability} from '../models/repeatability';
import rawStrings from '../raw-strings';

const renderRepeatability = (
	repeatability: Repeatability,
	language: AppLanguage = 'de'
) => {
	switch (repeatability) {
		case 'UMLIMITED':
			return rawStrings.REPEATABILITY_UNLIMITED[language];
		case 'TWICE':
			return rawStrings.REPEATABILITY_TWICE[language];
		case 'ONCE':
			return rawStrings.REPEATABILITY_ONCE[language];
		case 'ONCE_OR_REPLACED':
			return rawStrings.REPEATABILITY_ONCE_OR_REPLACED[language];
		case 'UZH_WWF':
			return rawStrings.REPEATABILITY_MULTIPLE[language];
		case 'ONCE_REPEATED_SUBSTITUTED_MAJOR':
			return rawStrings.REPEATABILITY_ONCE_REPEATED_SUBSTITUTED_MAJOR[language];
		case 'ONCE_OR_REPETITION_EXAM':
			return rawStrings.REPEATABILITY_ONCE_OR_REPETITION_EXAM[language];
		case 'ONCE_REPETITION_EXAM_OR_REBOOK':
			return rawStrings.REPEATABILITY_ONCE_REPETITION_EXAM_OR_REBOOK[language];
		default:
			return '';
	}
};

export default renderRepeatability;
