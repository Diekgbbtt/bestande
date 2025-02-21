import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useAppearance} from '../../../../core/functions/use-appearance';
import {useLanguage} from '../../../../core/functions/use-language';
import {Institution} from '../../../../core/models/credit';
import rawStrings from '../../../../core/raw-strings';
import {headerStyles} from '../../api/header-styles';
import {ReportGrade} from './ReportGrade';
import {ReportGradeConfirm} from './ReportGradeConfirm';
import {ReportGradeDone} from './ReportGradeDone';
import {ReportGradeEndDate} from './ReportGradeEndDate';

export type ReportGradeScreens = {
	ReportGradeStart: {
		uni_identifier: string;
		university: Institution;
		goToStatistic: () => void;
		usernameOverride: string | null;
		suggestedEndDate: number | null;
	};
	ReportGradeEndDate: {
		uni_identifier: string;
		university: Institution;
		exam_end_date: number;
		usernameOverride: string | null;
		suggestedEndDate: number | null;
	};
	ReportGradeConfirm: {
		exam_end_date: number;
		return_date: number;
		uni_identifier: string;
		university: Institution;
		usernameOverride: string | null;
	};
	ReportGradeDone: undefined;
};

const ReportGradeNavigator = createStackNavigator<ReportGradeScreens>();

export const ReportGradeStack: React.FC = () => {
	const appearance = useAppearance();
	const language = useLanguage();
	return (
		<ReportGradeNavigator.Navigator
			screenOptions={{
				headerStatusBarHeight: 12,
				...headerStyles(appearance, false),
			}}
		>
			<ReportGradeNavigator.Screen
				name="ReportGradeStart"
				component={ReportGrade}
				options={{
					title: rawStrings.REPORT_GRADE[language],
				}}
			/>
			<ReportGradeNavigator.Screen
				name="ReportGradeEndDate"
				component={ReportGradeEndDate}
				options={{
					title: rawStrings.EXAM_RETURN_DATE[language],
				}}
			/>
			<ReportGradeNavigator.Screen
				name="ReportGradeConfirm"
				component={ReportGradeConfirm}
				options={{
					title: rawStrings.CONFIRM_DATA[language],
				}}
			/>
			<ReportGradeNavigator.Screen
				name="ReportGradeDone"
				component={ReportGradeDone}
				options={{
					title: rawStrings.DONE[language],
				}}
			/>
		</ReportGradeNavigator.Navigator>
	);
};
