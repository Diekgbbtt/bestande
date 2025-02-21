import * as GradingEnum from '../../../core/models/grading';

export const parseGrading = (module: {
	ScaleDescription: string;
}): GradingEnum.Grading => {
	// UZH
	switch (module.ScaleDescription) {
		case '1-6 Quarter Grades Given':
			return GradingEnum.SWISS_QUARTER_GRADES;
		case '1-6, Half Grades Given':
			return GradingEnum.SWISS_HALF_GRADES;
		case '1-6, 0.5 (no longer in use)':
			return GradingEnum.SWISS_HALF_GRADES;
		case 'Pass/Fail':
			return GradingEnum.PASS_FAIL;
		case 'Accepted/Not Accepted':
			return GradingEnum.PASS_FAIL;
		case 'Participation':
			return GradingEnum.PARTICIPATION;
		case 'Fulfilled/Not Fulfilled':
			return GradingEnum.PASS_FAIL;
		case 'None':
			return GradingEnum.NONE;
		case 'Not Graded':
			return GradingEnum.NOT_GRADED;
		case 'Percentage Scale *':
			return GradingEnum.PERCENTAGE;
		case 'Pass/Cond. Pass/Fail':
			return GradingEnum.PASS_CONDITIONAL_FAIL;
		case 'Pass/Cond. Pass/Fail++':
			return GradingEnum.PASS_CONDITIONAL_FAIL;
		case 'MeF 1-6, in Half Grades with *':
			return GradingEnum.UZH_MEF_HALF_GRADES;
		case '1-6, Tenth Grades Given':
			return GradingEnum.SWISS_TENTH_GRADES;
		case '100-Point Scale':
			return GradingEnum.HUNDRED_POINT_SCALE;
		case '':
			return GradingEnum.UNKNOWN;
		default:
			throw new Error('Scale ' + module.ScaleDescription + ' is unknown');
	}
};
