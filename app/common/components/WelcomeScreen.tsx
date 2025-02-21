import React from 'react';
import {ImageURISource, ScrollView, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {setInstitution} from '../../../core/actions/institution';
import {CheckItem, Label, VSpace} from '../../../core/components/Base';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {Institution} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {hideContent} from '../../../core/reducers/hiddenContent';
import {globalNavigate} from '../api/set-master-navigator';
import {FeatureShowcase} from './FeatureShowcase';
import {ZurichAnimation} from './ZurichAnimation';

const Container = styled(ScrollView).attrs({
	contentContainerStyle: {
		justifyContent: 'center',
	},
})`
	flex: 1;
`;

const Title = styled(Text)`
	font-weight: bold;
	font-size: 16px;
	padding: 20px;
	padding-left: 10px;
`;

const Space = styled(View)<{
	height: number;
}>`
	height: ${(props) => props.height}px;
`;

const TitleIcon = styled(Image)`
	width: 26px;
	height: 26px;
	tint-color: ${(props) => props.theme.BLUE_TINT};
`;

const TitleView = styled(View)`
	flex-direction: row;
	align-items: center;
	margin-left: 10px;
`;

const Border = styled(View)`
	border-top-width: 1px;
`;

const AddModuleContainer = styled(View)`
	padding-left: 16px;
	padding-right: 16px;
`;

const TitleWithIcon = ({
	icon,
	title,
}: {
	icon: ImageURISource;
	title: string;
}) => {
	const appearance = useAppearance();
	return (
		<TitleView>
			<TitleIcon source={icon} />
			<Title style={{color: appearance.TITLE}}>{title}</Title>
		</TitleView>
	);
};

export const WelcomeScreen = () => {
	const institution = useAppState((state) => state.institution.institution);
	const language = useLanguage();
	const introSkipped = useAppState((state) =>
		state.hiddenContent.includes('intro')
	);
	const dispatch = useDispatch();
	const appearance = useAppearance();
	if (!introSkipped) {
		return (
			<FeatureShowcase
				onStart={() => {
					dispatch(hideContent('intro'));
				}}
			/>
		);
	}

	return (
		<Container style={{backgroundColor: appearance.BACKGROUND}}>
			<View>
				<TitleWithIcon
					icon={require('../assets/twotone_school_black_48dp.png')}
					title={`1. ${rawStrings.WELCOME_TO[language]}`}
				/>
				<Border style={{borderTopColor: appearance.BORDER_COLOR}} />
				<ZurichAnimation
					institution={institution}
					onChange={(_institution: Institution) => {
						dispatch(setInstitution(_institution));
					}}
				/>
			</View>
			{introSkipped ? (
				<>
					<TitleWithIcon
						icon={require('../assets/twotone_add_circle_black_48dp.png')}
						title={`2. ${rawStrings.ADD_YOUR_MODULES[language]}`}
					/>
					<AddModuleContainer>
						<VSpace />
						<CheckItem
							noCheck
							active
							onPress={() =>
								globalNavigate('Search', {
									institution,
								})
							}
						>
							<Label active>{rawStrings.ADD_MODULE[language]}</Label>
						</CheckItem>
					</AddModuleContainer>

					<Space height={20} />
				</>
			) : null}
		</Container>
	);
};
