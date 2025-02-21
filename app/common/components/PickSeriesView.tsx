import {RouteProp, useRoute} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {setSpecificConfig} from '../../../core/actions/seriesConfig';
import {AnimatedNativeScrollView} from '../../../core/components/AnimatedScrollView';
import {CheckItem, VSpace} from '../../../core/components/Base';
import {Dismisser} from '../../../core/components/Dismisser';
import {Config} from '../../../core/data/Config';
import {RN5Routes} from '../../../core/data/rn5-routes';
import {globalStyles} from '../../../core/functions/styles';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import {usePull} from '../../../core/functions/use-pull';
import {useNavigationInNative} from '../../../core/functions/useNavigationInNative';
import {Credit} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {getSeriesConfig} from '../api/get-series-config';
import {Header} from './Header';
import {SeriesPicker} from './SeriesPicker';

const Container = Config.IS_WEB_APP
	? styled(View)`
			flex: 1;
			background-color: ${(props) => props.theme.BACKGROUND};
			padding: 12px;
	  `
	: styled(AnimatedNativeScrollView).attrs({
			contentContainerStyle: {
				padding: 12,
			},
	  })`
			flex: 1;
			background-color: ${(props) => props.theme.BACKGROUND};
	  `;

const PickSeriesView = (props: {credit: Credit; semester: string}) => {
	const route = useRoute<RouteProp<RN5Routes, 'PickSeriesView'>>();
	const semester = props.semester || route.params.semester;
	const credit = props.credit || route.params.credit;
	const language = useLanguage();
	const seriesConfig = useAppState((state) =>
		getSeriesConfig(state, credit, semester)
	);
	const navigation = useNavigationInNative<'PickSeriesView'>();
	const dispatch = useDispatch();

	const dismisser = usePull({
		pixelsNeeded: 100,
		onPull: () => {
			navigation.goBack();
		},
	});

	return (
		<Container
			{...dismisser.scrollViewProps}
			contentContainerStyle={{
				padding: 12,
			}}
		>
			<Dismisser progress={dismisser.progress} />

			<Header text={rawStrings.TIMETABLE_PICKER_EXPLAINER[language]} />
			<SeriesPicker credit={credit} semester={semester} />
			<VSpace />
			<CheckItem
				style={globalStyles.flex1}
				noCheck
				onPress={() => {
					dispatch(setSpecificConfig(credit, seriesConfig));
					navigation.goBack();
				}}
				active
			/>

			<View style={{paddingBottom: 62}} />
		</Container>
	);
};

export default PickSeriesView;
