import {Institution} from '../models/credit';
import {ExamForm} from '../models/exam-form';
import {ModulePreview} from '../models/module';
import {PersonRaw} from './people-state';

type Assessment = {
	credits: number | null;
	exam_form?: ExamForm;
	exam_language?: string;
	attendance_confirmation_required?: string;
	exam_mode_eth?: string;
	additional_exam_mode_info_eth?: string;
	exam_allowed_helpers_written_eth?: string;
	repeatability_eth?: string;
	studies?: string[] | null;
	examiners: PersonRaw[];
	supplementary_helpers?: string;
	remark?: string;
};

export interface ClientAsessment extends Assessment {
	combination: ModulePreview[];
}

export interface ServerAssessment extends Assessment {
	combination: {
		uni_identifier: string;
		university: Institution;
	}[];
}
