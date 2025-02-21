import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import TimeTableViewContent from './TimetableViewContent';
import {UrgentBanner} from './UrgentBanner';

const Container = styled(View)`
	background-color: ${(props) => props.theme.BACKGROUND};
	flex: 1;
`;

export const TimeTableView: React.FC<{}> = () => {
	const timetableBanner = useAppState(
		(state) => state.corona.data?.timetableBanner
	);
	const language = useLanguage();
	return (
		<Container>
			{timetableBanner ? (
				<UrgentBanner
					text={timetableBanner.text[language]}
					link={timetableBanner.link}
				/>
			) : null}
			<TimeTableViewContent />
		</Container>
	);
};
