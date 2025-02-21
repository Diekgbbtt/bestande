import {RouteProp, useRoute} from '@react-navigation/native';
import sortBy from 'lodash/sortBy';
import React, {useEffect} from 'react';
import {FlatList, RefreshControl, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components';
import {VSpace} from '../../../core/components/Base';
import {BlockTextTitle} from '../../../core/components/BlockTextTitle';
import {FullScreenError} from '../../../core/components/FullScreenError';
import {ModulePreview as ModulePreviewComp} from '../../../core/components/ModulePreview';
import {SafeSideSpace} from '../../../core/components/SafeSideSpace';
import {UnifiedProgress} from '../../../core/components/UnifiedProgress';
import {RN5Routes} from '../../../core/data/rn5-routes';
import {getCourseSeries} from '../../../core/functions/api';
import {getReadableGroupName} from '../../../core/functions/course-code-map';
import {formatString} from '../../../core/functions/format-string';
import {uiKit} from '../../../core/functions/ui-kit';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {useNavigationInNative} from '../../../core/functions/useNavigationInNative';
import {ModulePreview as ModulePreviewType} from '../../../core/models/module';
import rawStrings from '../../../core/raw-strings';

const Container = styled(SafeSideSpace)`
	background-color: ${(props) => props.theme.BACKGROUND};
	flex: 1;
`;

const Subtitle = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
`;

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
	const paddingToBottom = 20;
	return (
		layoutMeasurement.height + contentOffset.y >=
		contentSize.height - paddingToBottom
	);
};

const OtherCourseSeries = () => {
	const [response, setResponse] = React.useState<ModulePreviewType[] | null>(
		null
	);
	const [loadingMore, setLoadingMore] = React.useState<boolean>(false);
	const [total, setTotal] = React.useState<number>(0);
	const [error, setError] = React.useState<string | null>(null);
	const navigation = useNavigationInNative<'OtherCoursesInSeries'>();
	const route = useRoute<RouteProp<RN5Routes, 'OtherCoursesInSeries'>>();
	const {institution, courseCode} = route.params;
	const language = useLanguage();

	const fetchData = React.useCallback(async () => {
		try {
			setResponse(null);
			setTotal(0);
			const data = await getCourseSeries(institution, courseCode.series);
			setResponse(data.modules);
			setTotal(data.total);
		} catch (err) {
			setError(err);
		}
	}, [courseCode, institution]);

	useEffect(() => {
		fetchData();
	}, [courseCode, fetchData, institution]);

	const appearance = useAppearance();

	const combined: ('header' | 'footer' | ModulePreviewType)[] | null = response
		? ['header', ...response, 'footer']
		: null;
	return (
		<Container>
			{error ? <FullScreenError error={error} /> : null}
			{combined ? (
				<FlatList
					refreshControl={
						<RefreshControl
							tintColor={appearance.SUBTITLE}
							colors={[appearance.SUBTITLE]}
							refreshing={false}
							onRefresh={() => {
								fetchData();
							}}
						/>
					}
					data={combined}
					keyExtractor={(m) =>
						m === 'header'
							? 'header'
							: m === 'footer'
							? 'footer'
							: m.uni_identifier
					}
					contentContainerStyle={{
						padding: 12,
					}}
					onScroll={async ({nativeEvent}) => {
						if (isCloseToBottom(nativeEvent)) {
							if (response && response.length !== total && !loadingMore) {
								setLoadingMore(true);
								const nextPage = Math.floor(response.length / 50);
								const data = await getCourseSeries(
									institution,
									courseCode.series,
									nextPage
								);
								setResponse([...response, ...data.modules]);
								setLoadingMore(false);
							}
						}
					}}
					renderItem={({item}) => {
						if (item === 'header') {
							return (
								<View>
									<BlockTextTitle>
										{getReadableGroupName(courseCode.series, language)}
									</BlockTextTitle>
									<VSpace />
									<Subtitle
										style={[uiKit.footnoteObject, {color: appearance.SUBTITLE}]}
									>
										{total === 1
											? rawStrings.ONE_RESULT_FOUND[language]
											: formatString(
													rawStrings.N_RESULTS_FOUND[language],
													String(total)
											  )}
									</Subtitle>
									<VSpace />

									<Subtitle
										style={[uiKit.footnoteObject, {color: appearance.SUBTITLE}]}
									>
										{rawStrings.COURSE_GROUP_NO_WARRANTY[language]}
									</Subtitle>
									<VSpace />
								</View>
							);
						}

						if (item === 'footer') {
							return (
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										flex: 1,
										justifyContent: 'center',
										height: 45,
									}}
								>
									{loadingMore ? <UnifiedProgress /> : null}
								</View>
							);
						}

						return (
							<View key={item.uni_identifier}>
								<TouchableOpacity
									onPress={() => {
										navigation.navigate('CreditDetailView', {
											moduleId: item.uni_identifier,
											semester: sortBy(item.semesters, (s) => 0 - s.period)[0]
												.period_human,
											institution,
											credit: null,
											chatFirst: false,
										});
									}}
								>
									<ModulePreviewComp credit={item} />
								</TouchableOpacity>
								<VSpace />
								<VSpace />
							</View>
						);
					}}
				/>
			) : (
				<View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
					<UnifiedProgress />
				</View>
			)}
		</Container>
	);
};

export default OtherCourseSeries;
