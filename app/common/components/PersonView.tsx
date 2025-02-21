import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {Fragment, useEffect} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-normalized';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import {fetchPerson} from '../../../core/actions/people';
import {
	BaseTouchable,
	Content,
	Label,
	shadow,
	VSpace,
} from '../../../core/components/Base';
import {BlockTextTitle} from '../../../core/components/BlockTextTitle';
import {ModulePreview as ModulePreviewComp} from '../../../core/components/ModulePreview';
import {SafeSideSpace} from '../../../core/components/SafeSideSpace';
import {UnifiedProgress} from '../../../core/components/UnifiedProgress';
import {RN5Routes} from '../../../core/data/rn5-routes';
import {sortModulesByRelevance} from '../../../core/functions/sort-modules-by-relevance';
import {globalStyles} from '../../../core/functions/styles';
import {mapToUniSlug, mapToUniversity} from '../../../core/functions/uni-slug';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {useNavigationInNative} from '../../../core/functions/useNavigationInNative';
import {AppLanguage} from '../../../core/models/app-language';
import {Institution} from '../../../core/models/credit';
import Module from '../../../core/models/module';
import {getNameWithoutTitle} from '../../../core/models/person';
import rawStrings from '../../../core/raw-strings';
import {getPerson} from '../../../core/reducers/people';
import {ExpandedPerson} from '../../../core/types/people-state';
import {ExternalLinks} from '../api/ExternalLinks';
import {BigCard} from './Card';

const ProfTitle = styled(Text)`
	margin-top: 3px;
`;

const RenderModules = ({
	responsible,
	teaching,
}: {
	responsible: Module[];
	teaching: Module[];
}) => {
	const navigation = useNavigationInNative<'PersonView'>();
	const language = useLanguage();
	const appearance = useAppearance();
	return (
		<View style={{paddingLeft: 12, paddingRight: 12}}>
			{teaching.length > 0 && (
				<View style={{backgroundColor: appearance.BACKGROUND, paddingTop: 10}}>
					<BlockTextTitle>{rawStrings.INSTRUCTING[language]}</BlockTextTitle>
					<VSpace />
				</View>
			)}
			{sortModulesByRelevance(teaching).map((module) => {
				return (
					<Fragment key={module.uni_identifier}>
						<TouchableOpacity
							onPress={() =>
								navigation.navigate('CreditDetailView', {
									moduleId: module.uni_identifier,
									semester: module.semesters[0].period_human,
									institution: module.university,
									credit: null,
									chatFirst: false,
								})
							}
						>
							<View {...shadow}>
								<ModulePreviewComp credit={module} />
							</View>
						</TouchableOpacity>
						<VSpace />
					</Fragment>
				);
			})}
			{responsible.length > 0 && (
				<View style={{backgroundColor: appearance.BACKGROUND, paddingTop: 15}}>
					<BlockTextTitle>
						{rawStrings.RESPONSIBLE_FOR[language]}
					</BlockTextTitle>
					<VSpace />
				</View>
			)}
			{sortModulesByRelevance(responsible).map((module) => {
				return (
					<TouchableOpacity
						key={module.uni_identifier}
						onPress={() =>
							navigation.navigate('CreditDetailView', {
								moduleId: module.uni_identifier,
								semester: module.semesters[0].period_human,
								institution: module.university,
								credit: null,
								chatFirst: false,
							})
						}
					>
						<View {...shadow}>
							<ModulePreviewComp credit={module} />
							<VSpace />
						</View>
					</TouchableOpacity>
				);
			})}
		</View>
	);
};

const PersonViewContent = ({
	person,
	language,
}: {
	person: ExpandedPerson;
	language: AppLanguage;
}) => {
	const appearance = useAppearance();
	return (
		<ScrollView style={globalStyles.flex1}>
			<SafeSideSpace>
				<BigCard>
					<BlockTextTitle>{getNameWithoutTitle(person)}</BlockTextTitle>
					{person.title ? (
						<ProfTitle style={{color: appearance.SUBTITLE}}>
							{person.title}
						</ProfTitle>
					) : null}
					<VSpace />
					<BaseTouchable
						padded
						onPress={() => ExternalLinks.openPerson(person)}
					>
						<Content>
							<Label>{rawStrings.OPEN_IN_VVZ[language]}</Label>
						</Content>
					</BaseTouchable>
				</BigCard>
				<RenderModules
					teaching={person.teaching as Module[]}
					responsible={person.responsible as Module[]}
				/>
				<VSpace />
				<VSpace />
				<VSpace />
				<VSpace />
			</SafeSideSpace>
		</ScrollView>
	);
};

export const PersonView = () => {
	const route = useRoute<RouteProp<RN5Routes, 'PersonView'>>();
	const {uni_identifier, unislug} = route.params;
	const institution = mapToUniversity(unislug);
	const apiResponse = useAppState((state) =>
		getPerson(
			state,
			mapToUniSlug(institution as Institution) + '/' + uni_identifier
		)
	);
	const language = useLanguage();

	const navigation = useNavigation();

	useEffect(() => {
		if (apiResponse.data) {
			navigation.setOptions({
				title: apiResponse.data?.name,
			});
		}
	}, [apiResponse, navigation]);

	const dispatch = useDispatch();
	const appearance = useAppearance();

	useEffect(() => {
		if (!apiResponse.data) {
			dispatch(
				fetchPerson(mapToUniSlug(institution as Institution), uni_identifier)
			);
		}
	}, [apiResponse.data, dispatch, institution, uni_identifier]);
	if (apiResponse.loading) {
		return (
			<View style={{flex: 1, backgroundColor: appearance.BACKGROUND}}>
				<UnifiedProgress />
			</View>
		);
	}

	if (!apiResponse.data) {
		return null;
	}

	return (
		<View style={{flex: 1, backgroundColor: appearance.BACKGROUND}}>
			<PersonViewContent person={apiResponse.data} language={language} />
		</View>
	);
};
