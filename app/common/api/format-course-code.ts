import {Institution} from '../../../core/models/credit';
import {CourseCode} from '../../../core/models/module';
import {UZH} from '../../../core/models/university';

export const formatCourseCode = (
	courseCode: CourseCode,
	university: Institution
) => {
	if (university === UZH && courseCode.display) {
		return courseCode.series + ' ' + courseCode.identifier;
	}

	return null;
};
