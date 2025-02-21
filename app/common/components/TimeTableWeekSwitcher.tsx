import ms from 'ms';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import styled from 'styled-components/native';
import {setWeek} from '../../../core/actions/timetable';
import {AppState} from '../../../core/types/app-state';
import {getTimeTableData} from '../api/timetable-data';

const ONE_WEEK = ms('7d');

const Button = styled(TouchableOpacity)<{
	increment: number;
}>`
	padding-top: 7px;
	padding-bottom: 7px;
	padding-${(props) => (props.increment > 0 ? 'left' : 'right')}: 10px;
`;

const Icon = styled.Image`
	tint-color: white;
	height: 32px;
	width: 32px;
`;

type Props = {
	availableSemesters: string[];
	setWeek: (semester: string, week: number) => void;
	semester: string;
	week: number;
	increment: number;
};

const TimeTableWeekSwitcher = (props: Props) => {
	if (props.availableSemesters.length === 0) {
		return null;
	}

	return (
		<Button
			onPress={() =>
				props.setWeek(props.semester, props.week + ONE_WEEK * props.increment)
			}
			style={{flex: 1}}
			increment={props.increment}
		>
			<View>
				<Icon
					source={
						props.increment > 0
							? require('../assets/chevron_right.png')
							: require('../assets/chevron_left.png')
					}
				/>
			</View>
		</Button>
	);
};

const Container = connect(
	(state: AppState) => {
		const {semester, currentWeek, availableSemesters} = getTimeTableData(state);

		const week = state.timetable.weeks[semester] || currentWeek;
		return {
			week,
			semester,
			availableSemesters,
		};
	},
	{setWeek}
)(TimeTableWeekSwitcher);

export default Container;
