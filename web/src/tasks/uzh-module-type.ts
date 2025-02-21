import * as ModuleTypesEnum from '../../../core/models/module-type';

// eslint-disable-next-line complexity
export const uzhModuleType = (moduleType: string): ModuleTypesEnum.ModuleType => {
	switch (moduleType) {
		case 'Lecture with Practical Exercises':
			return ModuleTypesEnum.LECTURE_AND_EXERCISES;
		case 'Other':
		case 'Sonstiges':
		case 'Repetition exam (same semester)':
		case 'Repetition exam':
		case 'Selbststudium mit Leistungsnachweis':
		case 'Master Paper / MA-Arbeit MNF':
		case 'Master Paper / MA-Arbeit':
		case 'Bachelor Paper / BA-Arbeit':
		case 'Beteiligung an Forschungsarbeiten':
		case 'Hausarbeit':
		case 'Bachelor Paper / BA-Arbeit MNF':
		case 'Externe Leistung':
		case 'Klinischer Kurs':
		case 'Semesterarbeit':
		case 'Selbstän. Lektüre mit Leistungsnachweis':
		case '5 Gutachten Dissertation':
		case 'Mittelseminar':
		case 'Referat / mündlicher Beitrag':
		case 'Repetitorium':
		case 'Arbeitsgemeinschaft':
		case 'Schriftlicher Beitrag':
		case 'Ergänzung (zu anderer Veranstaltung)':
		case 'Empirische Arbeit':
			return ModuleTypesEnum.OTHER;
		case 'Seminar':
		case 'Seminararbeit':
		case 'Doktorandenseminar':
		case 'Forschungsseminar':
		case 'Seminar mit Begleitveranstaltung':
			return ModuleTypesEnum.SEMINAR;
		case 'Course':
		case 'Kurs':
			return ModuleTypesEnum.COURSE;
		case 'Colloquium':
			return ModuleTypesEnum.COLLOQUIUM;
		case 'Examination':
		case 'Schriftliche Prüfung':
		case 'Mündliche Prüfung':
			return ModuleTypesEnum.EXAM;
		case 'Proseminar':
		case 'Proseminararbeit':
			return ModuleTypesEnum.PROSEMINAR;
		case 'Exercise Group':
			return ModuleTypesEnum.EXERCISES;
		case 'Tutorial':
		case 'Tutorat':
			return ModuleTypesEnum.TUTORIAL;
		case 'Practical Training':
		case 'Praktikum':
		case 'Praxiskurs':
		case 'Praktikum extern / Berufspraktikum':
			return ModuleTypesEnum.PRACTICAL_TRAINING;
		case 'Field Trip':
			return ModuleTypesEnum.FIELD_TRIP;
		case 'Independent Study':
			return ModuleTypesEnum.INDEPENDENT_STUDY;
		case 'Student Work':
			return ModuleTypesEnum.WORK;
		case 'Language Course':
		case 'Sprachkurs':
			return ModuleTypesEnum.LANGUAGE_COURSE;
		case 'Student input':
			return ModuleTypesEnum.OTHER;
		case 'Block Course':
			return ModuleTypesEnum.COURSE;
		case 'Meeting':
			return ModuleTypesEnum.MEETING;
		case 'Basic Principles':
			return ModuleTypesEnum.INTRODUCTION;
		case 'Revision Course':
			return ModuleTypesEnum.REVISION;
		case 'Achievement':
			return ModuleTypesEnum.OTHER;
		case 'Teaching Assistant':
			return ModuleTypesEnum.TEACHING_ASSISTANT;
		case '':
			return ModuleTypesEnum.OTHER;
		case 'Module':
			return ModuleTypesEnum.OTHER;
		case 'PHZH SEK I':
			return ModuleTypesEnum.PHZH_SEK_1;
		case 'PHZH SEK I Module':
			return ModuleTypesEnum.PHZH_SEK_1;
		case 'Module without Credits':
		case 'Prüfung ohne Lehrveranstaltung':
			return ModuleTypesEnum.OTHER;

		default:
			throw new Error(
				`Unknown module type: ${moduleType}. You need to do the mapping in the file uzh-module-type.ts`
			);
	}
};

