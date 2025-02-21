import React, {Fragment} from 'react';
import {ScrollView, View} from 'react-native';
import styled from 'styled-components/native';
import {VSpace} from '../../../core/components/Base';
import {SafeSideSpace} from '../../../core/components/SafeSideSpace';
import {getUniqueIdentifier} from '../../../core/functions/get-unique-identifier';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {getTimeTableData} from '../api/timetable-data';
import {CreditScheduleSummaryContent} from './CreditScheduleSummaryContent';

const Container = styled(ScrollView)`
	flex: 1;
	padding: 12px;
`;

const TimetableOptions = () => {
	const {bookedModules, semester} = useAppState((state) =>
		getTimeTableData(state)
	);
	const appearance = useAppearance();
	return (
		<SafeSideSpace style={{backgroundColor: appearance.BACKGROUND, flex: 1}}>
			<Container>
				{bookedModules.map((mod) => (
					<Fragment key={getUniqueIdentifier(mod)}>
						<CreditScheduleSummaryContent semester={semester} credit={mod} />
						<VSpace />
					</Fragment>
				))}
				<View style={{height: 30}} />
			</Container>
		</SafeSideSpace>
	);
};

export default TimetableOptions;
