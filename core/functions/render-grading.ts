import {AppLanguage} from '../models/app-language';
import * as GradingEnum from '../models/grading';
import rawStrings from '../raw-strings';

const renderGrading = (
	grading: GradingEnum.Grading | null,
	language: AppLanguage
): string => {
	switch (grading) {
		case 'NONE':
			return rawStrings.GRADING_NONE[language];
		case 'SWISS_QUARTER_GRADES':
			return rawStrings.SWISS_QUARTER_GRADES[language];
		case 'SWISS_HALF_GRADES':
			return rawStrings.SWISS_HALF_GRADES[language];
		case 'SWISS_TENTH_GRADES':
			return rawStrings.SWISS_TENTH_GRADES[language];
		case 'PASS_FAIL':
			return rawStrings.PASS_FAIL[language];
		case 'PARTICIPATION':
			return rawStrings.PARTICIPATION[language];
		case 'PASS_CONDITIONAL_FAIL':
			return rawStrings.PASS_CONDITIONAL_FILE[language];
		case 'PERCENTAGE':
			return rawStrings.PERCENTAGE[language];
		case 'NOT_GRADED':
			return rawStrings.NOT_GRADED[language];
		case 'UZH_MEF_HALF_GRADES':
			return rawStrings.UZH_MEF_HALF_GRADES[language];
		case 'HUNDRED_POINT_SCALE':
			return rawStrings.HUNDRED_POINT_SCALE[language];
		default:
			return '';
	}
};

export default renderGrading;
