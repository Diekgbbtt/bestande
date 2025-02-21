// UZH
export const NO_DATA = 'NO_DATA';
export const UMLIMITED = 'UMLIMITED';
export const TWICE = 'TWICE';
export const ONCE = 'ONCE';
export const ONCE_OR_REPLACED = 'ONCE_OR_REPLACED';
export const NONE = 'NONE';
export const UZH_WWF = 'UZH_WWF';
export const ONCE_REPEATED_SUBSTITUTED_MAJOR =
	'ONCE_REPEATED_SUBSTITUTED_MAJOR';

// ETH

// Repetition ohne erneute Belegung der Lerneinheit möglich.
export const REPETITION_EXAM = 'REPETITION_EXAM';

// Repetition nur nach erneuter Belegung der Lerneinheit möglich.
export const REPETITION_WITH_REDOING = 'REPETITION_WITH_REDOING';

// Die Leistungskontrolle wird in jeder Session angeboten. Die Repetition ist ohne\nerneute Belegung der Lerneinheit möglich.
export const REPETITION_EVERY_SESSION_NO_REDOING =
	'REPETITION_EVERY_SESSION_NO_REDOING';

// Es wird ein Repetitionstermin in den ersten zwei Wochen des unmittelbar nachfolgenden Semesters angeboten.
export const REPETITION_WITHIN_TWO_WEEKS_OF_NEXT_SEMESTER =
	'REPETITION_WITHIN_TWO_WEEKS_OF_NEXT_SEMESTER';

// Die Leistungskontrolle wird nur am Semesterende nach der Lerneinheit angeboten. Die Repetition ist nur nach erneuter Belegung möglich.
// Die Leistungskontrolle wird nur in der Session nach der Lerneinheit angeboten. Die Repetition ist nur nach erneuter Belegung möglich.
export const REDOING_REQUIRED = 'REDOING_REQUIRED';

// einmal wiederholb., Wiederholungsprüfung
export const ONCE_OR_REPETITION_EXAM = 'ONCE_OR_REPETITION_EXAM';

export const ONCE_REPETITION_EXAM_OR_REBOOK = 'ONCE_REPETITION_EXAM_OR_REBOOK';

export type Repeatability =
	| 'NO_DATA'
	| 'UMLIMITED'
	| 'TWICE'
	| 'ONCE'
	| 'ONCE_OR_REPLACED'
	| 'NONE'
	| 'UZH_WWF'
	| 'ONCE_REPEATED_SUBSTITUTED_MAJOR'
	| 'REPETITION_EXAM'
	| 'REPETITION_WITH_REDOING'
	| 'REPETITION_EVERY_SESSION_NO_REDOING'
	| 'REPETITION_WITHIN_TWO_WEEKS_OF_NEXT_SEMESTER'
	| 'REDOING_REQUIRED'
	| 'ONCE_OR_REPETITION_EXAM'
	| 'ONCE_REPETITION_EXAM_OR_REBOOK';
