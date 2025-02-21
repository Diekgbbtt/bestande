import React, {useEffect, useState} from 'react';
import {SectionList, View} from 'react-native';
import {ActivityIndicator} from 'react-native-normalized';
import styled from 'styled-components/native';
import {mapToUniSlug} from '../../functions/uni-slug';
import {Institution} from '../../models/credit';
import {DOMAIN} from '../../models/domain';
import {EventSerieWithEventsAndPeople} from '../../types/schedule';
import {FullScreenError} from '../FullScreenError';
import {TimetableEventSerieEvent} from './TimetableEventSerieEvent';
import {TimetableEventSerieHeader} from './TimetableEventSerieHeader';

const Container = styled(View)`
	flex: 1;
	background-color: ${(props) => props.theme.BACKGROUND};
`;

const JustifiedContainer = styled(Container)`
	justify-content: center;
	align-items: center;
`;

export const TimetableTab: React.FC<{
	institution: Institution;
	moduleId: string;
	semester: string;
}> = ({moduleId, semester, institution}) => {
	const [err, setError] = useState<Error | null>(null);
	const [data, setData] = useState<EventSerieWithEventsAndPeople[] | null>(
		null
	);
	useEffect(() => {
		fetch(
			`${DOMAIN}/institution/${mapToUniSlug(
				institution
			)}/module/${moduleId}/semester/${semester}/timetable`
		)
			.then((res) => res.json())
			.then((res) => {
				setData(res.data.data);
			})
			.catch((e) => setError(e));
	}, [institution, moduleId, semester]);

	if (err !== null) {
		return (
			<JustifiedContainer>
				<FullScreenError error={err.message} />
			</JustifiedContainer>
		);
	}

	if (data === null) {
		return (
			<JustifiedContainer>
				<ActivityIndicator />
			</JustifiedContainer>
		);
	}

	const SectionListData = data.map((eventSerie) => {
		return {
			serie: eventSerie,
			data: eventSerie.events.map((e, index) => {
				return {
					eventSerie,
					event: e,
					index,
					key: (e?.event_serie_id ?? '') + (e?.id ?? '') + index,
				};
			}),
		};
	});

	return (
		<Container>
			<SectionList
				initialNumToRender={40}
				sections={SectionListData}
				renderItem={({item}) => {
					return (
						<TimetableEventSerieEvent
							index={item.index}
							eventSerieEvent={item.event}
							institution={institution}
						/>
					);
				}}
				renderSectionHeader={({section: {serie}}) => {
					return <TimetableEventSerieHeader serie={serie} />;
				}}
			/>
		</Container>
	);
};
