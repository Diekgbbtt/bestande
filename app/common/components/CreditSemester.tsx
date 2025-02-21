import React, {ReactNode} from 'react';
import {connect} from 'react-redux';
import {setSemester} from '../../../core/actions/api';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {Credit, Institution} from '../../../core/models/credit';
import {ApiResponse} from '../../../core/reducers/api';
import {reduceSchedule} from '../../../core/reducers/schedule';
import {ApiResponseState} from '../../../core/types/api-reducer-state';
import {AppState} from '../../../core/types/app-state';
import {EventSerieWithEventsAndPeople} from '../../../core/types/schedule';
import {getSchedule} from '../actions/schedule';
import {getApiResponse} from '../api/get-api-response';
import {SemesterPicker} from './SemesterPicker';

type OwnProps = {
	semester: string;
	moduleId: string;
	credit: Credit;
	children: ReactNode;
};

const CreditSemester = (
	props: OwnProps & {
		apiResponse: ApiResponseState;
		setSemester: (
			institution: Institution,
			moduleId: string,
			semester: string
		) => void;
		getSchedule: (credit: Credit, semester: string) => void;
		hasSchedule: (semester: string) => EventSerieWithEventsAndPeople[] | null;
	}
) => {
	return (
		<SemesterPicker
			semester={props.semester}
			availableSemesters={(props.apiResponse.details as ApiResponse).semesters
				.map((s) => s.period_human)
				.slice(0, 7)}
			onChange={(s: string) => {
				if (!props.hasSchedule(s)) {
					props.getSchedule(props.credit, s);
				}

				props.setSemester(
					CreditHelpers.getInstitution(props.credit),
					props.moduleId,
					s
				);
			}}
		>
			{props.children}
		</SemesterPicker>
	);
};

export const CreditSemesterView = connect(
	(state: AppState, ownProps: OwnProps) => {
		return {
			apiResponse: getApiResponse(
				state,
				CreditHelpers.getInstitution(ownProps.credit),
				ownProps.moduleId
			),
			hasSchedule: (semester: string) =>
				reduceSchedule(
					state,
					ownProps.moduleId,
					semester,
					CreditHelpers.getInstitution(ownProps.credit)
				).schedule,
		};
	},
	{setSemester, getSchedule}
)(CreditSemester);
