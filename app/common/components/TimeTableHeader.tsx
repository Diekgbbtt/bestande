import React, {useMemo} from 'react';
import {useWindowDimensions, View} from 'react-native';
import {Text} from 'react-native-normalized';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {setSemester} from '../../../core/actions/timetable';
import {HSpace} from '../../../core/components/Base';
import {EventHelpers} from '../../../core/functions/EventHelpers';
import {renderSemester} from '../../../core/functions/render-semester';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {AppLanguage} from '../../../core/models/app-language';
import {PeriodHuman} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {getTimeTableData} from '../api/timetable-data';
import {SemesterPicker} from './SemesterPicker';

const Title = styled(Text)`
	color: white;
	align-self: center;
	font-weight: bold;
`;

const HeaderSubtitle = styled.View`
	align-self: center;
	flex-direction: row;
`;

const HeaderSubtitleLabel = styled(Text)`
	font-size: 12px;
	font-weight: bold;
`;

const Chevron = styled.Image.attrs({
	source: require('../assets/chevron_down.png'),
})`
	width: 16px;
	height: 16px;
`;

const renderText = (props: {dayRange: [Date, Date]; language: AppLanguage}) => {
	if (!props.dayRange) {
		return 'Laden...';
	}

	const [first, last] = props.dayRange;
	return (
		EventHelpers.getDate(first, props.language) +
		' – ' +
		EventHelpers.getDate(last, props.language)
	);
};

const TimeTableHeader: React.FC = () => {
	const appearance = useAppearance();
	const language = useLanguage();
	const dim = useWindowDimensions();
	const landscape = dim.width > dim.height;
	const {availableSemesters, semester, currentWeek} = useAppState((state) =>
		getTimeTableData(state)
	);
	const week = useAppState(
		(state) => state.timetable.weeks[semester] || currentWeek
	);
	const dayRange = useMemo(() => EventHelpers.getDayRange(week), [week]) as [
		Date,
		Date
	];
	const dispatch = useDispatch();
	if (availableSemesters.length === 0) {
		return (
			<View>
				<Title>{rawStrings.TIMETABLE[language]}</Title>
			</View>
		);
	}

	return (
		<SemesterPicker
			onChange={(s) => dispatch(setSemester(s as PeriodHuman))}
			semester={semester}
			availableSemesters={availableSemesters}
			style={{flex: 2, alignSelf: 'center', paddingTop: 6}}
		>
			<View style={{flexDirection: landscape ? 'row' : 'column'}}>
				<Title>{renderText({language, dayRange})}</Title>
				{landscape && (
					<>
						<HSpace />
						<HSpace />
					</>
				)}
				<HeaderSubtitle>
					<HeaderSubtitleLabel style={{color: appearance.HEADER_SUBTITLE}}>
						{renderSemester(semester, language)}
					</HeaderSubtitleLabel>
					<Chevron
						style={{
							tintColor: appearance.HEADER_SUBTITLE,
						}}
						source={require('../assets/chevron_down.png')}
					/>
				</HeaderSubtitle>
			</View>
		</SemesterPicker>
	);
};

export default TimeTableHeader;
