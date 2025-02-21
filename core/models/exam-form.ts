export const SESSION_EXAM = 'SESSION_EXAM'; // Sessionsprüfung
export const SEMESTER_EXAM_NOT_GRADED = 'SEMESTER_EXAM_NOT_GRADED'; // unbenotete Semesterleistung
export const SEMESTER_EXAM_GRADED = 'SEMESTER_EXAM_GRADED'; // benotete Semesterleistung
export const SEMESTER_END_EXAM = 'SEMESTER_END_EXAM'; // Semesterendprüfung
export const NO_EXAM = 'NO_EXAM'; // Keine Leistungskontrolle
export const NO_DATA = 'NO_DATA';

export type ExamForm =
	| 'SESSION_EXAM'
	| 'SEMESTER_EXAM_NOT_GRADED'
	| 'SEMESTER_EXAM_GRADED'
	| 'SEMESTER_END_EXAM'
	| 'NO_EXAM'
	| 'NO_DATA';
