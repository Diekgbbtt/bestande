import findIndex from 'lodash/findIndex';
import {GradeStatistic} from '../core/types/grade-statistics';

function uniqueKey(grade: GradeStatistic) {
	return grade.semester + grade.module;
}

export const handleRepeatExams = function (grades) {
	let usedKeys: {
		grade: number;
		key: string;
	}[] = [];
	for (let i = 0; i < grades.length; i++) {
		const grade = grades[i];
		grade.repeated = false;
		const key = uniqueKey(grade);
		const otherIndex = findIndex(usedKeys, (used) => used.key === key);
		usedKeys = [
			...usedKeys,
			{
				grade: Number.parseFloat(grade.grade),
				key,
			},
		];
		if (otherIndex > -1) {
			if (usedKeys[otherIndex].grade > Number.parseFloat(grade.grade)) {
				grades[otherIndex].repeated = true;
			} else {
				grade.repeated = true;
			}
		}
	}

	return grades;
};
