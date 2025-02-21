import sortBy from 'lodash/sortBy';
import React, {Fragment, useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {Alert, Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {
	DuotoneIcon,
	IconRow,
	IconRowLabel,
	VSpace,
} from '../../../core/components/Base';
import {BlockTextTitle} from '../../../core/components/BlockTextTitle';
import {ModulePreview} from '../../../core/components/ModulePreview';
import {SafeSideSpace} from '../../../core/components/SafeSideSpace';
import {UnifiedProgress} from '../../../core/components/UnifiedProgress';
import {getRecommendations} from '../../../core/functions/api';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {getVisibleCredits} from '../../../core/functions/Credits';
import {formatString} from '../../../core/functions/format-string';
import {getModuleId} from '../../../core/functions/get-module-id';
import {renderSemester} from '../../../core/functions/render-semester';
import {globalStyles} from '../../../core/functions/styles';
import {uiKit} from '../../../core/functions/ui-kit';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {useNavigationInNative} from '../../../core/functions/useNavigationInNative';
import {previousPeriod} from '../../../core/functions/validate-period';
import {recommendationPeriod} from '../../../core/models/current-period';
import rawStrings from '../../../core/raw-strings';
import {RecommendationResponse} from '../../../core/reducers/api';

const Suffix = styled(View)`
	padding: 8px;
	flex-direction: column;
	justify-content: center;
`;

const RecommendationView: React.FC = () => {
	const selectedInstitution = useAppState((s) => s.institution.institution);
	const [loading, setLoading] = useState(true);
	const navigation = useNavigationInNative<'RecommendationView'>();
	const summary = useAppState((s) => getVisibleCredits(s));
	const [institution] = useState(selectedInstitution);
	const [data, setData] = useState<null | RecommendationResponse>(null);
	const appearance = useAppearance();
	const language = useLanguage();

	useEffect(() => {
		const uniIdentifierArray: {uni_identifier: string}[] = summary
			.filter(
				(c) =>
					CreditHelpers.getPeriod(c) === previousPeriod(recommendationPeriod)
			)
			.map((c) => ({
				uni_identifier: getModuleId(c) as string,
			}));
		getRecommendations(institution, uniIdentifierArray)
			.then((result: {data: RecommendationResponse}) => {
				setLoading(false);
				setData(
					result.data.filter(
						(r) =>
							!summary.find((credit) => {
								return (
									r.module &&
									getModuleId(credit) === getModuleId(r.module) &&
									['PASSED', 'FAILED', 'CONTINUE'].includes(credit.status)
								);
							})
					)
				);
			})
			.catch((err) => {
				setLoading(false);
				setData(null);
				Alert.alert('Fehler: ' + err.message);
			});
	}, [institution, summary]);

	return (
		<SafeSideSpace style={{flex: 1, backgroundColor: appearance.BACKGROUND}}>
			{loading ? (
				<UnifiedProgress />
			) : (
				<ScrollView style={{backgroundColor: appearance.BACKGROUND}}>
					<VSpace />
					<VSpace />
					<BlockTextTitle style={{marginLeft: 16}}>
						{formatString(
							rawStrings.MODULES_COULD_BE_INTERESTING[language],
							renderSemester(recommendationPeriod, language) as string
						)}
					</BlockTextTitle>
					<VSpace />
					<IconRow style={{paddingLeft: 20, paddingRight: 20}}>
						<DuotoneIcon
							style={{
								tintColor: appearance.BLUE_TINT,
							}}
							source={require('../assets/twotone_people_outline_black_48dp.png')}
						/>
						<View style={globalStyles.flex1}>
							<IconRowLabel style={{color: appearance.SUBTITLE}}>
								{rawStrings.RECOMMENDATION_BASED[language]}
							</IconRowLabel>
						</View>
					</IconRow>
					<View style={{height: 10}} />
					<IconRow style={{paddingLeft: 20, paddingRight: 20}}>
						<DuotoneIcon
							style={{
								tintColor: appearance.BLUE_TINT,
							}}
							source={require('../assets/twotone_bookmarks_black_48dp.png')}
						/>
						<View style={globalStyles.flex1}>
							<IconRowLabel style={{color: appearance.SUBTITLE}}>
								{rawStrings.RECOMMENDATION_TIMETABLE[language]}
							</IconRowLabel>
						</View>
					</IconRow>
					<VSpace />
					<VSpace />
					{data ? (
						<View style={{marginLeft: 16, marginRight: 16}}>
							{data
								.filter((d) => d.module)
								.map((d) => (
									<Fragment key={d.module.uni_identifier}>
										<TouchableOpacity
											key={d.module.uni_identifier}
											onPress={() => {
												navigation.navigate('CreditDetailView', {
													moduleId: d.module.uni_identifier,
													semester: sortBy(
														d.module.semesters,
														(s) => 0 - s.period
													)[0].period_human,
													institution,
													credit: null,
													chatFirst: false,
												});
											}}
										>
											<View
												style={{
													borderRadius: 5,
													backgroundColor: 'white',
												}}
												// @ts-expect-error
												shadowColor="rgba(0, 0, 0, 0.1)"
												shadowOffset={{width: 0, height: 0}}
												shadowRadius={5}
												shadowOpacity={1}
											>
												<ModulePreview
													credit={d.module}
													suffix={
														<Suffix>
															<View>
																<View style={globalStyles.flex1} />
															</View>

															<View style={globalStyles.flex1}>
																{d.correlated ? (
																	<Text
																		style={[
																			uiKit.footnoteObject,
																			{
																				color: appearance.SUBTITLE,
																			},
																		]}
																	>
																		{formatString(
																			rawStrings.X_MATCH_WITH_OTHER_COURSE[
																				language
																			],
																			(
																				Math.min(
																					d.count / d.correlated.totalCount,
																					1
																				) * 100
																			).toFixed(0),
																			d.correlated.related.short_name
																		)}
																	</Text>
																) : null}
															</View>
														</Suffix>
													}
												/>
											</View>
										</TouchableOpacity>
										<VSpace />
									</Fragment>
								))}
						</View>
					) : null}
				</ScrollView>
			)}
		</SafeSideSpace>
	);
};

export default RecommendationView;
