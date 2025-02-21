import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {SafeSideSpace} from '../../../core/components/SafeSideSpace';
import {RN5Routes} from '../../../core/data/rn5-routes';
import {getCredit} from '../../../core/functions/get-credit';
import {mapToUniversity} from '../../../core/functions/uni-slug';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {SeriesPicker} from './SeriesPicker';

const Container = styled(ScrollView).attrs({
	contentContainerStyle: {
		padding: 12,
	},
})`
	flex: 1;
`;

const TimetableOptionDetail = () => {
	const route = useRoute<RouteProp<RN5Routes, 'TimetableOptionDetail'>>();
	const {semester, uni_identifier, unislug} = route.params;
	const institution = mapToUniversity(unislug);
	const credit = useAppState((s) =>
		getCredit(s, uni_identifier, semester, institution)
	);

	const navigation = useNavigation();
	const appearance = useAppearance();

	useEffect(() => {
		navigation.setOptions({
			title: credit.short_name,
		});
	}, [credit.short_name, navigation]);

	return (
		<SafeSideSpace style={{flex: 1, backgroundColor: appearance.BACKGROUND}}>
			<Container>
				<SeriesPicker credit={credit} semester={semester} />
			</Container>
		</SafeSideSpace>
	);
};

export default TimetableOptionDetail;
