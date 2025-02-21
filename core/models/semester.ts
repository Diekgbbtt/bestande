import {periodToString as uzhFormat} from '../functions/uzh-period';
import {SemesterResponse} from '../reducers/api';
import {ClientAsessment, ServerAssessment} from '../types/assessments';
import {InstructorWithTypeArray} from '../types/instructor';
import {EventSerieType, RawPerson} from '../types/schedule';
import {Grading} from './grading';
import {NO_DATA, Repeatability} from './repeatability';

export const semesterFormatPeriod = (sem: Semester | SemesterResponse) =>
	uzhFormat(sem.period);

class Semester {
	registration_start: Date | null;
	registration_end: Date | null;
	cancellation_start: Date | null;
	cancellation_end: Date | null;
	period: number;
	credits: number | null;
	credit_hours: number | null;
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
	assessment: ServerAssessment[] | null;
	responsible: string[] | RawPerson[];
	instructors: InstructorWithTypeArray[];
	test: string | null;
	seats_restriction: string | null;
	structure?: string | null;
	additional_information?: string | null;
	waiting_list: string | null;
	exam_literature: string | null;
	olat: {url: string} | null;
	links: {url: string; title: string}[] | null;
	period_human: string;
	constructor(data: {
		registration_start?: Date | null;
		registration_end?: Date | null;
		cancellation_start?: Date | null;
		cancellation_end?: Date | null;
		period: number;
		credits: number | null;
		credit_hours?: number | null;
		repeatability?: Repeatability;
		event_series?: EventSerieType[];
		description: string | null;
		content?: string | null;
		audience?: string | null;
		objective: string | null;
		materials: string | null;
		prerecognitions?: string | null;
		prerequisites: string | null;
		grading?: Grading | null;
		lecture_notes?: string | null;
		comment?: string | null;
		assessment?: ServerAssessment[] | ClientAsessment[] | null;
		responsible?: string[] | RawPerson[];
		instructors: InstructorWithTypeArray[];
		test?: string | null;
		structure?: string | null;
		additional_information?: string | null;
		exam_literature?: string | null;
		seats_restriction?: string | null;
		waiting_list?: string | null;
		olat?: {url: string} | null;
		links?: {url: string; title: string}[] | null;
	}) {
		this.registration_start = null;
		this.registration_end = null;
		this.cancellation_start = null;
		this.cancellation_end = null;
		this.period = data.period;
		this.credits = null;
		this.repeatability = NO_DATA;
		this.description = null;
		this.content = null;
		this.audience = null;
		this.objective = null;
		this.materials = null;
		this.prerecognitions = null;
		this.prerequisites = null;
		this.grading = null;
		this.lecture_notes = null;
		this.comment = null;
		this.assessment = null;
		this.test = null;
		this.seats_restriction = null;
		this.structure = null;
		this.additional_information = null;
		this.waiting_list = null;
		this.credit_hours = null;
		const event_series: EventSerieType[] = [];
		this.event_series = event_series;
		this.olat = null;
		this.links = null;
		this.exam_literature = null;
		this.responsible = [];
		this.instructors = [];
		this.period_human = uzhFormat(this.period);
		Object.assign(this, data);
		if (
			data.responsible &&
			data.responsible.length > 0 &&
			typeof data.responsible[0] !== 'string'
		) {
			this.responsible = data.responsible as RawPerson[];
		}
	}
}

export default Semester;
