import ellipsize from 'ellipsize';
import sortBy from 'lodash/sortBy';
import React, {ReactElement} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import Module, {
	ModulePreview as ModulePreviewType,
} from '../../core/models/module';
import {uiKit} from '../functions/ui-kit';
import {useAppearance} from '../functions/use-appearance';
import {SemesterResponse} from '../reducers/api';
import {RatingSummary} from './RatingSummary';

const Container = styled(View)`
	border-width: 1px;
	border-color: ${(props) => props.theme.BORDER_COLOR};
	border-radius: 5px;
	overflow: hidden;
`;

const Line = styled(View)`
	border-bottom-width: 1px;
	border-bottom-color: ${(props) => props.theme.BORDER_COLOR};
`;

const Content = styled(View)`
	padding: 8px;
`;

const CourseCodeLabel = styled(Text)`
	text-transform: uppercase;
	font-weight: bold;
	font-size: 12px;
	color: ${(props) => props.theme.SUBTITLE};
`;

export const ModulePreview = ({
	credit,
	suffix,
}: {
	credit: ModulePreviewType | Module;
	suffix?: string | ReactElement;
}) => {
	const firstSemester = sortBy(
		credit.semesters,
		(s) => 0 - (s as SemesterResponse).period
	)[0];
	const appearance = useAppearance();
	return (
		<Container style={{backgroundColor: appearance.BACKGROUND}}>
			<Content>
				{credit.courseCode?.display ? (
					<View>
						<CourseCodeLabel>
							{credit.courseCode.series} {credit.courseCode.identifier}
						</CourseCodeLabel>
					</View>
				) : null}
				<View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
					<Text
						style={[uiKit.subheadEmphasizedObject, {color: appearance.TITLE}]}
					>
						{credit.short_name}
					</Text>
				</View>
				<Text style={{...uiKit.footnoteObject, color: appearance.SUBTITLE}}>
					{ellipsize(
						((firstSemester as SemesterResponse)?.description ?? '').substr(0),
						150,
						{
							truncate: true,
						}
					)}
				</Text>
				<View style={{flexDirection: 'row', alignItems: 'center'}}>
					<RatingSummary result={credit as ModulePreviewType} />
					<Text
						style={{fontSize: 12, color: appearance.SUBTITLE, marginTop: 3}}
					>
						{credit.ratingSummary?.average ? ' • ' : null}
						{(firstSemester as SemesterResponse).credits
							? (parseFloat(
									String((firstSemester as SemesterResponse).credits)
							  ) || 0) + ' ECTS'
							: null}
						{' • '}
						{(firstSemester as SemesterResponse).period_human}
					</Text>
				</View>
			</Content>
			{suffix ? (
				<React.Fragment>
					<Line />
					{suffix}
				</React.Fragment>
			) : null}
		</Container>
	);
};
