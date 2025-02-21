import * as ExamForm from '../../../core/models/exam-form';

export const parseExamForm = (form: string): ExamForm.ExamForm => {
	switch (form) {
		case 'Sessionsprüfung':
			return ExamForm.SESSION_EXAM;
		case 'unbenotete Semesterleistung':
			return ExamForm.SEMESTER_EXAM_NOT_GRADED;
		case 'benotete Semesterleistung':
			return ExamForm.SEMESTER_EXAM_GRADED;
		case 'Semesterendprüfung':
			return ExamForm.SEMESTER_END_EXAM;
		case 'keine Leistungskontrolle':
			return ExamForm.NO_EXAM;
		default:
			return ExamForm.NO_DATA;
	}
};
