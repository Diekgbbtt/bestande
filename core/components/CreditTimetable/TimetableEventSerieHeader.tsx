import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import renderModuleType from '../../functions/render-module-type';
import {globalStyles} from '../../functions/styles';
import {useLanguage} from '../../functions/use-language';
import rawStrings from '../../raw-strings';
import {EventSerieWithEventsAndPeople} from '../../types/schedule';
import {Column, Row} from '../Primitives';
import {SafeSideSpace} from '../SafeSideSpace';
import {TimetableHeaderPerson} from './TimeTableHeaderPerson';

const Container = styled(Column)`
	padding-left: 12px;
	padding-right: 12px;
	padding-top: 8px;
	padding-bottom: 8px;
	background-color: ${(props) => props.theme.SECTION_HEADER_BACKGROUND};
`;

const Title = styled(Text)`
	color: ${(props) => props.theme.TITLE};
`;

const Subtitle = styled(Text)`
	font-size: 13px;
	color: ${(props) => props.theme.SUBTITLE};
`;

const TitleRow = styled(Row)`
	align-items: center;
	margin-bottom: 4px;
`;

export const TimetableEventSerieHeader: React.FC<{
	serie: EventSerieWithEventsAndPeople;
}> = ({serie}) => {
	const language = useLanguage();
	return (
		<Container>
			<SafeSideSpace>
				<TitleRow>
					<Title>{renderModuleType(serie.category, language)}</Title>
					<View style={globalStyles.flex1} />
					<Subtitle>{serie.time_label}</Subtitle>
				</TitleRow>
				{serie.comments ? <Subtitle>{serie.comments}</Subtitle> : null}
				{serie.people.map((p) => {
					return (
						<TimetableHeaderPerson
							key={p.uni_identifier + p.university}
							person={p}
						/>
					);
				})}
				{serie.smart ? (
					<Subtitle>{rawStrings.TIMETABLE_SMART_DISCLAIMER[language]}</Subtitle>
				) : null}
			</SafeSideSpace>
		</Container>
	);
};
