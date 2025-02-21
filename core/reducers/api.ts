import {
	FetchModuleDetailsAction,
	FETCH_MODULE_DETAILS,
	ModuleDetailsFetchError,
	MODULE_DETAILS_ERROR,
	ReceiveModuleDetailsAction,
	RECEIVE_MODULE_DETAILS,
	SetSemesterAction,
	SET_MODULE_SEMESTER,
} from '../actions/api';
import {getChatRoomIdentifier} from '../functions/get-chat-room-identifier';
import {Institution} from '../models/credit';
import {Department} from '../models/eth-departments';
import {Grading} from '../models/grading';
import {
	CourseCode,
	GradStatsSummary,
	ModulePreview,
	RatingSummary,
	TranslatedName,
	UserCount,
} from '../models/module';
import {ModuleType} from '../models/module-type';
import {Repeatability} from '../models/repeatability';
import {UZHFaculty} from '../models/uzh-faculties';
import {ApiReducerState} from '../types/api-reducer-state';
import {ClientAsessment} from '../types/assessments';
import {ImageType} from '../types/image';
import {InstructorWithTypeArray} from '../types/instructor';
import {EventSerieType, RawPerson} from '../types/schedule';

const initialState = {};

type ModuleState = {
	loading: boolean;
	details: ApiResponse | null;
	error: string | null;
	semester: string | null;
};

export const initialModuleState: ModuleState = {
	loading: true,
	details: null,
	error: null,
	semester: null,
};

export type InstructorsResponse = (InstructorWithTypeArray & {
	instructor: RawPerson;
})[];

export type SemesterResponse = {
	registration_start: Date | null;
	registration_end: Date | null;
	cancellation_start: Date | null;
	cancellation_end: Date | null;
	period: number;
	credits: number | null;
	credit_hours?: number | null;
	repeatability: Repeatability;
	event_series: EventSerieType[];
	description: string | null;
	content: string | null;
	audience: string | null;
	objective: string | null;
	materials: string | null;
	prerecognitions: string | null;
	prerequisites: string | null;
	grading: Grading | null;
	lecture_notes: string | null;
	comment: string | null;
	assessment: ClientAsessment[] | null;
	responsible: RawPerson[];
	instructors: InstructorsResponse;
	test: string | null;
	seats_restriction: string | null;
	waiting_list: string | null;
	exam_literature: string | null;
	olat: {url: string} | null;
	links: {url: string; title: string}[] | null;
	period_human: string;
	structure?: string | null;
	additional_information?: string | null;
};

export type ApiResponse = {
	header_image: ImageType | null;
	related?: ModulePreview[];
	semesters: SemesterResponse[];
	name: string;

	short_name: string;
	userCount: UserCount;
	gradeStatistics: GradStatsSummary;
	ratingSummary?: RatingSummary;
	university: Institution;
	uni_identifier: string;
	departments?: Department[] | null;
	faculty: UZHFaculty;
	courseCode: CourseCode | null;
	type: ModuleType;
	slug?: string[];
	translatedNames?: TranslatedName[];
};

type Recommendation = {
	module: ModulePreview;
	count: number;
	correlated: null | {
		count: number;
		totalCount: number;
		related: ModulePreview;
	};
};

export type Related = {
	module: ModulePreview;
	count: number;
};

export type RecommendationResponse = Recommendation[];
export type RelatedResponse = Related[];

export const apiReducer = (
	state: ApiReducerState = initialState,
	action:
		| FetchModuleDetailsAction
		| ReceiveModuleDetailsAction
		| ModuleDetailsFetchError
		| SetSemesterAction
): ApiReducerState => {
	switch (action.type) {
		case FETCH_MODULE_DETAILS:
			return {
				...state,
				[getChatRoomIdentifier(action.moduleId, action.institution)]: {
					...state[getChatRoomIdentifier(action.moduleId, action.institution)],
					loading: true,
					details: null,
					error: null,
				},
			};
		case RECEIVE_MODULE_DETAILS:
			return {
				...state,
				[getChatRoomIdentifier(action.moduleId, action.institution)]: {
					...state[getChatRoomIdentifier(action.moduleId, action.institution)],
					loading: false,
					details: action.details,
					error: null,
				},
			};
		case MODULE_DETAILS_ERROR:
			console.log(action.err);
			return {
				...state,
				[getChatRoomIdentifier(action.moduleId, action.institution)]: {
					...state[getChatRoomIdentifier(action.moduleId, action.institution)],
					loading: false,
					details: null,
					error: action.err.message,
				},
			};
		case SET_MODULE_SEMESTER:
			return {
				...state,
				[getChatRoomIdentifier(action.moduleId, action.institution)]: {
					...state[getChatRoomIdentifier(action.moduleId, action.institution)],
					semester: action.semester,
				},
			};
		default:
			return state;
	}
};
