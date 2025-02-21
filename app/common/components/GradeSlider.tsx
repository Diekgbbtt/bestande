import React from 'react';
import {View} from 'react-native';
import CheckBox from 'react-native-check-box';
import {Text} from 'react-native-normalized';
import styled from 'styled-components';
import {VSpace} from '../../../core/components/Base';
import {Colors} from '../../../core/functions/Colors';
import {CountsTowardsAverage} from '../../../core/functions/CountsTowardsAverage';
import {useLanguage} from '../../../core/functions/use-language';
import {UntypedGrade} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {SliderWithValue} from './SliderWithValue';

const Container = styled(View)`
	align-items: flex-end;
`;

const labelStyle = {
	fontSize: 14,
	marginTop: 6,
	marginBottom: 6,
	marginLeft: 5,
};

const Label = styled(Text)`
	color: ${(props) => props.theme.TITLE};
`;

export const GradeSlider = (props: {
	grade: UntypedGrade;
	onGradeChanged: (grade: number | string) => void;
	onFinishedGradeChanging: (grade: number | string) => void;
}) => {
	const {grade} = props;
	const language = useLanguage();
	const numeric = CountsTowardsAverage.parseGrade(grade);
	const inPassedRange = numeric && numeric >= 4;
	const theme = inPassedRange ? Colors.Green : Colors.Red;
	const withoutGrade = props.grade === 'BEST' || props.grade === 'N. BE';
	return (
		<Container>
			<SliderWithValue
				minimum={1}
				maximum={6}
				step={0.25}
				minimumTrackTintColor={theme}
				onValueChange={(value) => {
					props.onGradeChanged(value);
				}}
				onSlidingComplete={(value) => {
					props.onFinishedGradeChanging(value);
				}}
				value={CountsTowardsAverage.parseGrade(props.grade) || undefined}
				customLabel={typeof props.grade === 'string' ? props.grade : undefined}
				precision={2}
			/>
			<VSpace />
			<CheckBox
				isChecked={withoutGrade}
				rightTextView={
					<Label style={labelStyle}>
						{inPassedRange
							? rawStrings.PASSED_WITHOUT_GRADE[language]
							: rawStrings.FAILED_WITHOUT_GRADE[language]}
					</Label>
				}
				checkBoxColor={theme}
				onClick={() => {
					if (withoutGrade) {
						props.onGradeChanged(numeric as number);
						props.onFinishedGradeChanging(numeric as number);
						return;
					}

					if (inPassedRange) {
						props.onGradeChanged('BEST');
						props.onFinishedGradeChanging('BEST');
					} else {
						props.onGradeChanged('N. BE');
						props.onFinishedGradeChanging('N. BE');
					}
				}}
			/>
		</Container>
	);
};
