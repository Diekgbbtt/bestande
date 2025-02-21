import * as RepeatabilityEnum from '../../../core/models/repeatability';

export const uzhRepeatability = (module: {
	RepeatType: string;
}): RepeatabilityEnum.Repeatability => {
	switch (module.RepeatType) {
		case '0X':
			return RepeatabilityEnum.NONE;
		case '1X':
			return RepeatabilityEnum.ONCE;
		case '1XS':
		case '1XB':
			return RepeatabilityEnum.ONCE_OR_REPLACED;
		case '2X':
			return RepeatabilityEnum.TWICE;
		case 'XX':
			return RepeatabilityEnum.UMLIMITED;
		case 'WWF':
			return RepeatabilityEnum.UZH_WWF;
		case '1XHF':
			return RepeatabilityEnum.ONCE_REPEATED_SUBSTITUTED_MAJOR;
		case '1XW':
			return RepeatabilityEnum.ONCE_OR_REPETITION_EXAM;
		case '1XWB':
			return RepeatabilityEnum.ONCE_REPETITION_EXAM_OR_REBOOK;
		case '':
			return RepeatabilityEnum.NO_DATA;
		default:
			throw new Error('Repeatability type ' + module.RepeatType + ' not found');
	}
};
