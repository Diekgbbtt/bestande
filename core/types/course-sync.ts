import {Institution, UntypedGrade} from '../models/credit';

type CourseRequest = {
	uni_identifier: string;
	period: number;
	university: Institution;
	grade: UntypedGrade;
};

type UpdateCoursePayload =
	| {
			type: 'set-courses';
			courses: CourseRequest[];
	  }
	| {
			type: 'remove-course';
			removal: {
				uni_identifier: string;
				university: Institution;
			};
	  };

export type UpdateCoursesRequest = {
	payload: UpdateCoursePayload;
	token: string;
	nonce: number;
};

export type SetCoursesResponse = {
	newNonce: number;
};

export type NonceResponse = {
	nonce: number;
};
