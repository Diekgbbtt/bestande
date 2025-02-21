import {AppLanguage} from '../models/app-language';
import {
	COLLOQUIUM,
	COURSE,
	EXAM,
	EXERCISES,
	FIELD_TRIP,
	INDEPENDENT_STUDY,
	INTRODUCTION,
	LANGUAGE_COURSE,
	LECTURE_AND_EXERCISES,
	MEETING,
	ModuleType,
	OTHER,
	PHZH_SEK_1,
	PRACTICAL_TRAINING,
	PROSEMINAR,
	REPETITION_EXAM,
	REVISION,
	SEMINAR,
	TEACHING_ASSISTANT,
	TUTORIAL,
	WORK,
} from '../models/module-type';
import rawStrings from '../raw-strings';

const renderModuleType = (
	type: ModuleType | undefined,
	language: AppLanguage = 'de'
): string => {
	switch (type) {
		case LECTURE_AND_EXERCISES:
			return rawStrings.LECTURE_EXERCISE[language];
		case OTHER:
			return rawStrings.OTHER[language];
		case SEMINAR:
			return rawStrings.SEMINAR[language];
		case COURSE:
			return rawStrings.LECTURE[language];
		case COLLOQUIUM:
			return rawStrings.COLLOQUIUM[language];
		case EXAM:
			return rawStrings.EXAM[language];
		case REPETITION_EXAM:
			return rawStrings.REPETITION_EXAM[language];
		case PROSEMINAR:
			return rawStrings.PROSEMINAR[language];
		case EXERCISES:
			return rawStrings.EXERCISE_GROUP[language];
		case TUTORIAL:
			return rawStrings.TUTORIAL[language];
		case PRACTICAL_TRAINING:
			return rawStrings.PRACTICAL_TRAINING[language];
		case FIELD_TRIP:
			return rawStrings.EXCURSION[language];
		case INDEPENDENT_STUDY:
			return rawStrings.INDEPENDENT_STUDY[language];
		case WORK:
			return rawStrings.WORK[language];
		case LANGUAGE_COURSE:
			return rawStrings.LANGUAGE_COURSE[language];
		case MEETING:
			return rawStrings.MEETING[language];
		case INTRODUCTION:
			return rawStrings.INTRODUCTION[language];
		case REVISION:
			return rawStrings.REVISION[language];
		case TEACHING_ASSISTANT:
			return rawStrings.TEACHING_ASSISSTANT[language];
		case PHZH_SEK_1:
			return 'PHZH SEK 1';
		default:
			return rawStrings.OTHER[language];
	}
};

export default renderModuleType;
