import React from 'react';
import {match as Match} from 'react-router-dom';
import {TimetableTab} from '../../../core/components/CreditTimetable/TimetableTab';
import {semesterFormatPeriod} from '../../../core/models/semester';
import {ApiResponse} from '../../../core/reducers/api';

type OwnProps = {
	module: ApiResponse;
	match: Match<{
		semester: string;
	}>;
};

export const ModuleTimetable: React.FC<OwnProps> = ({module, match}) => {
	return (
		<div style={{minHeight: 400}}>
			<TimetableTab
				institution={module.university}
				moduleId={module.uni_identifier}
				semester={
					match.params.semester || semesterFormatPeriod(module.semesters[0])
				}
			/>
		</div>
	);
};
